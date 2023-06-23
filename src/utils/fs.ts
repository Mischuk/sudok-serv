import fs from 'fs';
import path from 'path';

function updateFile(filename: string, data: any) {
    return new Promise((resolve, reject) => {
        const resolvedPath = path.resolve(__dirname, '..', 'data', filename);

        fs.writeFile(resolvedPath, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
}

function readFile(filename: string) {
    return new Promise((resolve, reject) => {
        fs.readFile(
            path.resolve(__dirname, '..', 'data', filename),
            'utf8',
            (err, jsonString) => {
                try {
                    const dataObj = JSON.parse(jsonString);
                    resolve(dataObj);
                    return;
                } catch (error) {
                    console.log('Error parse JSON string', error);
                    reject(new Error('Error parse JSON string'));

                    if (err) {
                        console.log('Error reading file from disk:', err);
                        reject(new Error('Error reading file from disk:'));
                    }
                }
            }
        );
    });
}

export { updateFile, readFile };
