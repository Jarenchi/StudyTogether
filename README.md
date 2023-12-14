# StudyTogether

## Table of Contents

- [Features](#features)
- [Demo Account](#demo-account)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Contact](#contact)

## Features

#### Clubs

Users can create or join clubs

#### Events

Users can join or host diverse events, whether they are online meetups or in-person gatherings,

#### Documents

Facilitating collaboration, users can edit documents collectively with fellow club members, enabling seamless teamwork and information sharing.

#### Mettings

Utilizing liveKit, StudyTogether enables users to conduct engaging online activities. This includes interactive chat rooms and screen sharing features, enhancing the overall experience of virtual meetings and events.

#### Members

Empowering administrators, StudyTogether allows for the effective management of users within a club. Additionally, a draw function is available, bringing an element of fun and randomness to user interactions.

#### Dashboard

The dashboard provides users with a comprehensive overview of their weekly usage statistics and tracking records.

## Demo Account

- Account: test@test.com
- Password: Aa123456

## Requirements

- Node.js version: 20.9.0

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

## Architecture
 ![studyTogether drawio](https://github.com/Jarenchi/StudyTogether/assets/107235245/c00635ce-d3be-4484-adf0-eaf4675b45be)

## Tech Stack

### Frontend

- Framework: [Next.js 14](https://nextjs.org/) (App Router)
- UI: [Tailwind CSS](https://tailwindcss.com/) , [Shadcn UI](https://ui.shadcn.com/)
- Form : [React Hook Form](https://react-hook-form.com/) , [Zod](https://zod.dev/)
- Data fetching : [TanStack Query](https://tanstack.com/query/latest)
- State management : [Zustand](https://zustand-demo.pmnd.rs/)
- Table : [TanStack Table](https://tanstack.com/table/v8)
- Text Editor : [ReactQuill](https://github.com/zenoamaro/react-quill) , [Socket.io](https://socket.io/)
- Streaming : [LiveKit](https://livekit.io/)
- Dashboard : [Tremor](https://www.tremor.so/)

### Backend

- Backend: [Express JS](https://expressjs.com/)
- Database: [MongoDB Altas](https://www.mongodb.com/cloud/atlas)
- ODM : [Moongoose](https://mongoosejs.com/)
- [Socket.io](https://socket.io/)
- [NodeMailer](https://nodemailer.com/)

## Contact

- Jaren Chang - jaren719@gmail.com
