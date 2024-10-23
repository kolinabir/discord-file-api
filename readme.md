# Discord File API

[![npm version](https://img.shields.io/npm/v/discord-file-api.svg)](https://www.npmjs.com/package/discord-file-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Node.js package that provides an Express API for uploading and downloading unlimited files using Discord as storage. Store your files securely using Discord's infrastructure.

📦 [NPM Package](https://www.npmjs.com/package/discord-file-api)  
🔗 [GitHub Repository](https://github.com/kolinabir/discord-file-api)

## Features

- 🚀 Easy integration with Express.js
- 📁 File upload and download functionality
- 🔐 Secure storage using Discord's infrastructure
- 💪 TypeScript support
- ⚡ Async/await API

## Installation

```bash
npm install discord-file-api
```
```bash
yarn add discord-file-api
```

## Setup Guide

1. Create a Discord bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Add the bot to your server with file permissions
3. Create a channel for file storage
4. Get your bot token and channel ID
5. Configure environment variables:

```bash
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CHANNEL_ID=your_channel_id
```

## TypeScript Usage

```typescript
import express from "express";
import { createDiscordUploadAPI, initializeDiscordBot } from "discord-file-api";
import dotenv from "dotenv";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();
app.use(express.json());

// Initialize Discord bot
(async () => {
  await initializeDiscordBot({
    botToken: process.env.DISCORD_BOT_TOKEN as string, 
    channelId: process.env.DISCORD_CHANNEL_ID as string,
  });

  // Use the API routes
  app.use("/api", createDiscordUploadAPI());

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
```

## JavaScript Usage

```javascript
const express = require('express');
const { createDiscordUploadAPI, initializeDiscordBot } = require('discord-file-api');

const app = express();
const port = 3000;

// Initialize Discord bot
(async () => {
  await initializeDiscordBot({
    botToken: 'YOUR_DISCORD_BOT_TOKEN',
    channelId: 'YOUR_DISCORD_CHANNEL_ID'
  });

  // Use the API routes
  app.use('/api', createDiscordUploadAPI());

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})();
```

## API Testing with Postman

### Postman Collection Details
- Collection Name: discord bot testing
- Collection ID: 564a5917-1013-478d-86eb-77e0e9088c5c

### Upload Endpoint
**POST** `http://localhost:3000/api/upload`
- Method: POST
- Body: form-data
  - Key: `file`
  - Type: File
  - Example: Upload any file from your system

Sample Request:
```http
POST http://localhost:3000/api/upload
Content-Type: multipart/form-data
Body: form-data
  - file: <your_file>
```

### Download Endpoint
**POST** `http://localhost:3000/api/download`
- Method: POST
- Body: raw (JSON)
- Content-Type: application/json

Sample Request:
```http
POST http://localhost:3000/api/download
Content-Type: application/json

{
    "fileUrl": "https://cdn.discordapp.com/attachments/1031194794812264533/1298772008208957534/midRoutine.pdf?ex=671ac730&is=671975b0&hm=2716ddce69ccd2f4772a03c813407016b37c0fda2c3decf60bc7fa303bb58794&"
}
```

## API Endpoints

### Upload File
`POST /api/upload`

```javascript
// Client-side upload example
const formData = new FormData();
formData.append('file', yourFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const { fileLink } = await response.json();
```

### Download File
`POST /api/download`

```javascript
// Client-side download example
const response = await fetch('/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileUrl: 'YOUR_DISCORD_FILE_URL'
  })
});

if (response.ok) {
  const blob = await response.blob();
  // Process your file...
}
```

## Complete Example

### Server Implementation

```javascript
const express = require('express');
const { createDiscordUploadAPI, initializeDiscordBot } = require('discord-file-api');
require('dotenv').config();

const app = express();
app.use(express.json());

async function startServer() {
  try {
    await initializeDiscordBot({
      botToken: process.env.DISCORD_BOT_TOKEN,
      channelId: process.env.DISCORD_CHANNEL_ID
    });

    app.use('/api', createDiscordUploadAPI());

    app.listen(3000, () => {
      console.log('🚀 Server running on port 3000');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

startServer();
```

### Client Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <title>Discord File Upload Example</title>
</head>
<body>
    <div class="upload-container">
        <input type="file" id="fileInput">
        <button onclick="uploadFile()">Upload File</button>
    </div>

    <script>
        async function uploadFile() {
            const fileInput = document.getElementById('fileInput');
            const file = fileInput.files[0];
            
            if (!file) {
                alert('Please select a file');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const { fileLink } = await response.json();
                console.log('✅ File uploaded successfully:', fileLink);
            } catch (error) {
                console.error('❌ Upload failed:', error);
            }
        }
    </script>
</body>
</html>
```

## Error Handling

The API uses standard HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request - Missing file or URL |
| 500 | Server Error - Upload/download failed |

Example error handling:

```javascript
try {
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
} catch (error) {
  console.error('Upload failed:', error.message);
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made by [Abir Kolin](https://github.com/kolinabir)