# StudyTogether

## Table of Contents

- [Features](#features)
- [Demo Account](#demo-account)
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Third Party Services](#third-party-services)
- [Contact](#contact)

## Features

#### Clubs

Users can create or join clubs

#### Events

Users can join or host events

#### Documents

Users can

#### Mettings

#### Members

#### Dashboard

## Demo Account

- Account: test@test.com
- Password: Aa123456

## RequirementS

- Node.js version: 20.9.0
- Frontend: Node.js
- Backend: Node.js, MongoDB Altas

## Installation

```
$ git clone https://github.com/Jarenchi/StudyTogether.git
$ cd StudyTogether
```

### Frontend

```
$ cd client
$ npm install
$ npm run dev
```

### Backend

```
$ cd server
$ npm install
$ npm run dev
```

## Environment Variables

### Frontend

```
LIVEKIT_API_KEY= # YOUR LIVEKIT API key
LIVEKIT_API_SECRET= # YOUR LIVEKIT API secret
NEXT_PUBLIC_LIVEKIT_URL= # YOUR LIVEKIT URL
NEXT_PUBLIC_API_URL= # YOUR BACKEND URL
NEXT_PUBLIC_SOCKET_URL= # YOUR SOCKET URL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY= # YOUR GOOGLE MAPS API key
```

### Backend 　

```
MONGODB= # YOUR MONGODB ALTAS
HIDDEN_SECRET= # YOUR JWT HIDDEN SECRET
IMGUR_CLIENTID= # YOUR IMGUR CLIENT ID
IMGUR_CLIENT_SECRET= # YOUR IMGUR CLIENT SECRET
IMGUR_REFRESH_TOKEN= # YOUR IMGUR REFRESH TOKEN
IMGUR_ALBUM_ID= # YOUR IMGUR ALBUM ID
GOOGLE_MAPS_API_KEY= # YOUR GOOGLE MAPS API key
EMAIL= # YOUR NODEMAILER EMAIL
EMAIL_PASS= # YOUR EMAIL PASSWORD
FRONTEND_URL= # YOUR FRONTEND URL
```

## Stack

### Frontend

- Language: TypeScript
- Framework: Next.js 14 (App Router)
- UI: Tailwind CSS , Shadcn UI
- Form : React Hook Form , Zod
- Data fetching: TanStack Query
- State management: Zustand
- Table: TanStack Table
- Text Editor: ReactQuill, Socket.io
- Stream: LiveKit
- Dashboard: Tremor

### Backend

- Backend: Express JS, Socket.io
- Database: MongoDB (moongoose)

## Third party services

- Imgur
- Google Maps API
- LiveKit

## Contact

- Jaren Chang - jaren719@gmail.com
