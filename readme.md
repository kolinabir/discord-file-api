# Discord File API

A Node.js package that provides an Express API for uploading and downloading files using Discord as storage.

## Installation

```bash
npm install discord-file-api
```

## Setup

1. Create a Discord bot at https://discord.com/developers/applications
2. Add the bot to your server with file permissions
3. Create a channel for file storage
4. Get your bot token and channel ID
5. Set up your environment variables:

```bash
DISCORD_BOT_TOKEN=your_bot_token
DISCORD_CHANNEL_ID=your_channel_id
```


## Usage TypeScript

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


## Usage JavaScript

```javascript
const express = require('express');
const { createDiscordUploadAPI, initializeDiscordBot } = require('discord-file-api');

const app = express();
const port = 3000;

// Initialize Discord bot
await initializeDiscordBot({
  botToken: 'YOUR_DISCORD_BOT_TOKEN',
  channelId: 'YOUR_DISCORD_CHANNEL_ID'
});

// Use the API routes
app.use('/api', createDiscordUploadAPI());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

## API Endpoints

### Upload File
**POST** `/api/upload`
```javascript
// Using fetch
const formData = new FormData();
formData.append('file', yourFile);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
});

const { fileLink } = await response.json();
```

### Download File
**POST** `/api/download`
```javascript
// Using fetch
const response = await fetch('/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileUrl: 'YOUR_DISCORD_FILE_URL'
  })
});

// Handle the file download
if (response.ok) {
  const blob = await response.blob();
  // Process your file...
}
```



## Example Implementation

```javascript
const express = require('express');
const { createDiscordUploadAPI, initializeDiscordBot } = require('discord-file-api');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize the Discord bot
async function startServer() {
  try {
    await initializeDiscordBot({
      botToken: process.env.DISCORD_BOT_TOKEN,
      channelId: process.env.DISCORD_CHANNEL_ID
    });

    // Mount the API routes
    app.use('/api', createDiscordUploadAPI());

    // Start server
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
```

## Client-Side Example

```html
<input type="file" id="fileInput">
<button onclick="uploadFile()">Upload</button>

<script>
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const { fileLink } = await response.json();
    console.log('File uploaded:', fileLink);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
</script>
```

## Error Handling

The API returns appropriate HTTP status codes:
- 400: Bad request (missing file or URL)
- 500: Server error (upload/download failed)

Always wrap API calls in try/catch blocks to handle potential errors.

## License

MIT


## API Endpoints

### Upload File
POST `/api/upload`
- Request: Multipart form data with a file field named "file"
- Response: JSON containing the Discord file URL

### Download File
POST `/api/download`
- Request: JSON body with `fileUrl` field
- Response: File download stream

## License
MIT
