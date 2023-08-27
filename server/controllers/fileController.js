const mongoose = require("mongoose");
const FileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const config = require("config");
const fs = require("fs");
const fileService = require("../services/fileService");
const { validateResult, validationResult } = require("express-validator");

class FileController {
  async createDir(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            message: errors.errors.map((e) => e.msg).join("\n"),
            errors: errors.errors,
          });
      }

      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });

      if (!parentFile) {
        file.path = name;
        await FileService.createDir(file);
      } else {
        file.path = `${parentFile.path}\\${file.name}`;
        await FileService.createDir(file);
        parentFile.children.push(file._id);
        await parentFile.save();
      }

      await file.save();
      return res.json(file);
    } catch (e) {
      console.log(e);
      return res.status(500).json(e);
    }
  }

  async getDirInfo(req, res) {
    try {
      const { id } = req.query;
      if (!id) {
        return res
          .status(400)
          .json({ message: "Request must have id request" });
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({
            message:
              "'id' query parameter must be a string of 12 bytes or a string of 24 hex characters or an integer",
          });
      }

      const data = await File.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id), user: new mongoose.Types.ObjectId(req.user.id), type: "dir" } },
        {
          $graphLookup: {
            from: "files",
            startWith: "$parent",
            connectFromField: "parent",
            connectToField: "_id",
            as: "ancestors",
          },
        },
        {
          $project: {
            "ancestors.type": 0,
            "ancestors.size": 0,
            "ancestors.path": 0,
            "ancestors.date": 0,
            "ancestors.children": 0,
          },
        },
      ]);

      if (data.length == 0) {
        return res.status(404).json({ message: "Directory not found" });
      }

      const dir = data[0];

      const ancestors = dir.ancestors;
      let lastDir = undefined;
      for (let i = 0; i < ancestors.length; i++) {
        for (let j = i; j < ancestors.length; j++) {
            console.log(`${i} ${j} ${ancestors[j].parent} ${ancestors[j].name}`);
            const parent = ancestors[j].parent;
            if (!parent || parent?.equals(lastDir)) {
                const t = ancestors[i];
                ancestors[i] = ancestors[j];
                ancestors[j] = t;
                lastDir = ancestors[i]._id;
                break;
            }
        }
      }

      dir.ancestors = ancestors;

      return res.json(dir);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Can't find dir" });
    }
  }

  async getFiles(req, res) {
    try {
      const { sort } = req.query;
      let files;
      switch (sort) {
        case "name":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ name: 1 });
          break;
        case "type":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ type: 1 });
          break;
        case "date":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ date: 1 });
          break;
        case "size":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ size: 1 });
          break;
        default:
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          });
          break;
      }
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Can't get files" });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;

      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });
      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.diskSpace) {
        return res.status(400).json({ message: "No space on the disk" });
      }

      user.usedSpace = user.usedSpace + file.size;

      let path;
      if (parent) {
        path = `${config.get("filePath")}\\${user._id}\\${parent.path}\\${
          file.name
        }`;
      } else {
        path = `${config.get("filePath")}\\${user._id}\\${file.name}`;
      }

      if (fs.existsSync(path)) {
        return res.status(400).json({ message: "File already exists" });
      }
      file.mv(path);

      const type = file.name.split(".").pop();
      let filePath = file.name;
      if (parent) {
        filePath = `${parent.path}\\${file.name}`;
      }
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent: parent?._id,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      return res.json(dbFile);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Upload error" });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      const path = FileService.getPath(file);
      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }
      return res.status(400).json({ message: "Download error" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Download error" });
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      const user = await User.findOne({ _id: req.user.id });

      fileService.deleteFile(file);
      user.usedSpace = user.usedSpace - file.size;
      await File.deleteOne({ _id: file._id });
      await user.save();
      return res.json({ message: "File was deleted" });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Directory is not empty" });
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) => file.name.includes(searchName));
      return res.json(files);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Search error" });
    }
  }
}

module.exports = new FileController();
