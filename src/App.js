import React, { useState } from "react";
import "./App.css";
function ImageUpload() {
  const [data, setData] = useState();
  console.log(data);

  const handleConvert = async () => {
    if (!data) {
      alert("Lütfen bir fotoğraf yükleyin.");
      return;
    }
    if (data[0].type !== "image/jpeg") {
      const img = await convertToJPEG(data[0]);
      downloadImage(img);
    } else {
      downloadImage(data[0]);
      // alert("Fotoğraf zaten JPEG formatında.");
    }
  };

  const convertToJPEG = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const jpegData = canvas.toDataURL("image/jpeg");
          const jpegFile = dataURItoBlob(jpegData);
          resolve(jpegFile);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const downloadImage = (img) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(img);
    a.download = "image.jpeg";
    a.click();
    // setData(img)
    // console.log(setData)
    console.log(`Resmin kilobayt değeri: ${data[0].size / 1000} kb`);
  };

  const handleResize = async () => {
    if (!data) {
      alert("Lütfen bir fotoğraf yükleyin.");
      return;
    }
    if (data[0].size > 50000) {
      const img = await resizeImage(data[0]);
      downloadImage(img);
      console.log(`Yeni resmin kilobayt değeri: ${img.size / 1000} kb`);
    } else {
      alert("Fotoğraf zaten 50 kb'den küçük.");
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        while (canvas.toDataURL().length > 50000) {
          canvas.width *= 0.6;
          canvas.height *= 0.6;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const jpegData = canvas.toDataURL("image/jpeg", 0.7);
        const jpegFile = dataURItoBlob(jpegData);
        resolve(jpegFile);
      };
      img.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="main">
      <div className="uploadimage">
        <label htmlFor="imgs">Resim Yükle</label>
      </div>
      <input
        id="imgs"
        type="file"
        accept="image/*"
        onChange={(e) => setData(e.target.files)}
      />
      <div className="uploadimage" type="button" onClick={handleConvert}>
        Dönüştür
      </div>
      <div className="uploadimage" type="button" onClick={handleResize}>
        Kb küçült
      </div>
    </div>
  );
}
export default ImageUpload;