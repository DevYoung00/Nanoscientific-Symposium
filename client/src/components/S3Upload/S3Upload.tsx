import React, { Dispatch, SetStateAction, useState } from "react";
import AWS from "aws-sdk";
import { Button, Fab } from "@mui/material";
import AddPhotoAlternateTwoToneIcon from "@mui/icons-material/AddPhotoAlternateTwoTone";

interface S3UploadProps {
  setImagePath: Dispatch<SetStateAction<string>>;
  edit: boolean;
  previewURL: string;
  setPreviewURL: Dispatch<SetStateAction<string>>;
}

const S3Upload = ({
  setImagePath,
  edit = false,
  previewURL = "",
  setPreviewURL,
}: S3UploadProps) => {
  const [progress, setProgress] = useState<number>(0);
  const ACCESS_KEY = process.env.REACT_APP_S3_ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.REACT_APP_S3_SECRET_ACCESS_KEY;
  const REGION = "us-west-1";
  const S3_BUCKET = "nss-integration";

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (
      !(
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg"
      )
    ) {
      alert("only jpg allowed");
      return;
    }
    setProgress(0);
    uploadFile(file);
  };

  const uploadFile = (file: File) => {
    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: S3_BUCKET,
      Key: `upload/${file.name}-${Date.now()}`,
    };

    myBucket
      .putObject(params)
      .on("httpUploadProgress", (evt, res) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
        setTimeout(() => {
          console.log("완료");
        }, 3000);
      })
      .send((err, data) => {
        if (err) console.log(err);
        setImagePath(params.Key);
        setPreviewURL(params.Key);
      });
  };
  return (
    <div>
      <h2>Choose Image</h2>
      <label htmlFor="contained-button-file">
        <input
          style={{ display: "none" }}
          accept="image/*"
          type="file"
          onChange={handleFileInput}
          id="contained-button-file"
        />
        <Fab component="span">
          <AddPhotoAlternateTwoToneIcon />
        </Fab>
        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          {progress}%
        </span>
        {previewURL && (
          <img
            style={{ marginLeft: "10px", width: "100px", height: "100px" }}
            src={`https://nss-integration.s3.us-west-1.amazonaws.com/${previewURL}`}
            alt="preview"
          />
        )}
      </label>
    </div>
  );
};

export default S3Upload;