import DataUriParser from "datauri/parser.js"

import path from "path";

const getDataUri = (file) => {
    // Check if file exists before accessing its properties
    if (!file) return null;
    
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
}

export default getDataUri;