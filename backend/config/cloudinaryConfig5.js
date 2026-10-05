import fs from "fs";
import crypto from "crypto";
import https from "https";

const getCloudName = () => process.env.CLOUD_NAME5;
const getApiKey = () => process.env.API_KEY5;
const getApiSecret = () => process.env.API_SECRET5;

const requireConfig = () => {
  if (!getCloudName() || !getApiKey() || !getApiSecret()) {
    throw new Error(
      "Cloudinary Account 5 is not configured. Please set CLOUD_NAME5, API_KEY5 and API_SECRET5 in .env."
    );
  }
};

const signParams = (params) => {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(filtered + getApiSecret())
    .digest("hex");
};

const requestMultipart = (url, fields, filePath = null) =>
  new Promise((resolve, reject) => {
    const boundary = `----IMSECCloudinary${Date.now()}${Math.random()
      .toString(16)
      .slice(2)}`;
    const chunks = [];

    const addField = (name, value) => {
      chunks.push(
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
        )
      );
    };

    Object.entries(fields).forEach(([name, value]) => addField(name, value));

    let fileBuffer = null;
    let fileName = "file";

    if (filePath) {
      fileBuffer = fs.readFileSync(filePath);
      fileName = filePath.split(/[\\/]/).pop() || "file";
      chunks.push(
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName.replace(/"/g, "")}"\r\nContent-Type: application/octet-stream\r\n\r\n`
        )
      );
      chunks.push(fileBuffer);
      chunks.push(Buffer.from("\r\n"));
    }

    chunks.push(Buffer.from(`--${boundary}--\r\n`));
    const body = Buffer.concat(chunks);

    const parsed = new URL(url);
    const req = https.request(
      {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        path: `${parsed.pathname}${parsed.search}`,
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": body.length,
        },
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch {
            parsedData = { raw: data };
          }

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            const message =
              parsedData?.error?.message ||
              parsedData?.message ||
              `Cloudinary request failed with status ${res.statusCode}`;
            reject(new Error(message));
          }
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });

const normalizeResourceType = (resourceType) => {
  if (resourceType === "auto") return "image";
  if (resourceType === "raw" || resourceType === "video" || resourceType === "image") {
    return resourceType;
  }
  return "image";
};

export const uploadToCloudinary5 = async (filePath, options = {}) => {
  requireConfig();

  if (!filePath) {
    throw new Error("Cloudinary upload file is missing.");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Upload file not found: ${filePath}`);
  }

  const resourceType = normalizeResourceType(options.resource_type || "image");
  const timestamp = Math.floor(Date.now() / 1000);

  const params = {
    timestamp,
    ...(options.folder ? { folder: options.folder } : {}),
    ...(options.public_id ? { public_id: options.public_id } : {}),
  };

  const signatureParams = {
    timestamp,
    ...(options.folder ? { folder: options.folder } : {}),
    ...(options.public_id ? { public_id: options.public_id } : {}),
  };

  const endpoint = `https://api.cloudinary.com/v1_1/${getCloudName()}/${resourceType}/upload`;

  const result = await requestMultipart(endpoint, {
    ...params,
    api_key: getApiKey(),
    signature: signParams(signatureParams),
  }, filePath);

  return result;
};

export const destroyFromCloudinary5 = async (publicId, options = {}) => {
  requireConfig();

  if (!publicId) return { result: "not found" };

  const resourceType = normalizeResourceType(options.resource_type || "image");
  const timestamp = Math.floor(Date.now() / 1000);
  const invalidate = options.invalidate === false ? undefined : true;

  const signatureParams = {
    public_id: publicId,
    timestamp,
    ...(invalidate ? { invalidate: true } : {}),
  };

  const endpoint = `https://api.cloudinary.com/v1_1/${getCloudName()}/${resourceType}/destroy`;

  return requestMultipart(endpoint, {
    public_id: publicId,
    timestamp,
    ...(invalidate ? { invalidate: true } : {}),
    api_key: getApiKey(),
    signature: signParams(signatureParams),
  });
};

// Drop-in subset used by the IMSEC controllers. It intentionally does not call
// cloudinary.config(), so Account 5 cannot overwrite any other Cloudinary account.
const cloudinary5 = {
  uploader: {
    upload: uploadToCloudinary5,
    destroy: destroyFromCloudinary5,
  },
};

export default cloudinary5;
