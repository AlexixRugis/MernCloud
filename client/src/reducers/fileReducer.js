const SET_FILES = 'SET_FILES';
const SET_CURRENT_DIR = 'SET_CURRENT_DIR';
const ADD_FILE = 'ADD_FILE';
const PUSH_TO_STACK = 'PUSH_TO_STACK';
const SET_STACK_INDEX = 'SET_STACK_INDEX';
const DELETE_FILE = 'DELETE_FILE';
const SET_VIEW = 'SET_VIEW';
const CLEAR = 'CLEAR';

const defaultState = {
    files: [],
    currentDir: null,
    dirStack: [], 
    view: 'list'
};

export default function fileReducer(state = defaultState, action) {
    switch (action.type) {
        case SET_FILES:
            return {
                ...state,
                files: action.payload
            };
        case SET_CURRENT_DIR:
            return {
                ...state,
                currentDir: action.payload
            }
        case ADD_FILE:
            return {
                ...state,
                files: [...state.files, action.payload]
            }
        case PUSH_TO_STACK:
            return {
                ...state,
                dirStack: [...state.dirStack, action.payload]
            }
        case SET_STACK_INDEX:
            if (action.payload >= state.dirStack.length) return state;
            return {
                ...state,
                currentDir: state.dirStack[action.payload],
                dirStack: state.dirStack.slice(0, action.payload)
            }
        case DELETE_FILE:
            return {
                ...state,
                files: [...state.files.filter(file => file._id !== action.payload)]
            }
        case SET_VIEW:
            return {
                ...state,
                view: action.payload
            }
        case CLEAR: return defaultState;
        default:
            return state
    }
}

export const setFiles = (files) => ({type: SET_FILES, payload: files});
export const setCurrentDir = (dir) => ({type: SET_CURRENT_DIR, payload: dir});
export const addFile = (file) => ({type: ADD_FILE, payload: file});
export const pushToStack = (dir) => ({type: PUSH_TO_STACK, payload: dir});
export const setStackIndex = (index) => ({type: SET_STACK_INDEX, payload: index});
export const removeFile = (file) => ({type: DELETE_FILE, payload: file});
export const setView = (view) => ({type: SET_VIEW, payload: view});