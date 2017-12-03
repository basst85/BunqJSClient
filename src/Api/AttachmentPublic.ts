import ApiAdapter from "../ApiAdapter";
import Session from "../Session";
import ApiEndpointInterface from "../Interfaces/ApiEndpointInterface";

export default class AttachmentPublic implements ApiEndpointInterface {
    ApiAdapter: ApiAdapter;
    Session: Session;

    /**
     * @param {ApiAdapter} ApiAdapter
     */
    constructor(ApiAdapter: ApiAdapter) {
        this.ApiAdapter = ApiAdapter;
        this.Session = ApiAdapter.Session;
    }

    public async post(file: File, options: any = {}) {
        const limiter = this.ApiAdapter.RequestLimitFactory.create(
            "/attachment-public",
            "POST"
        );

        const fileReader = new FileReader();

        // start loading the file as binary
        fileReader.readAsBinaryString(file);

        // wrap the filereader callback in a promise
        const response: any = await new Promise((resolve, reject) => {
            fileReader.onload = () => {
                // get the resulting binary data
                // const data = fileReader.result;
                const fs = require("fs");
                const data = fs.readFileSync(
                    "./app/png.png",
                    // "./app/jpg.jpg",
                    "utf-8"
                );

                console.log(data);

                // do the actual call
                limiter
                    .run(async () =>
                        this.ApiAdapter.post(`/v1/attachment-public`, data, {
                            // "Content-Type": file.type,
                            "Content-Type": "image/png",
                            "X-Bunq-Attachment-Description": "attachment"
                        })
                    )
                    .then(resolve)
                    .catch(reject);
            };
        });

        return response.Response[0].Uuid.uuid;
    }
}
