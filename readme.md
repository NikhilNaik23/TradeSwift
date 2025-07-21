# TradeSwift – Modern Buy & Sell Marketplace

**TradeSwift** is a robust, full-stack buy/sell marketplace platform featuring:

- Real-time chat (Socket.IO)
- Role-based dashboards (seller & buyer)
- Product marketplace, cart, and orders
- Secure authentication, instant role switching
- Responsive UI and clear layouts for every user type

---

## 🚀 Features

- **Role-Based System**

  - Seller and Buyer accounts with dashboard switching
  - Instant role switching in Profile page

- **Authentication & Authorization**

  - Secure JWT + httpOnly Cookie auth
  - Protected REST routes (Express.js) and layouts (React Router)

- **Product Marketplace**

  - Add, edit, view, search, filter, and buy products (as seller/buyer)
  - Cart management

- **Order Processing**

  - Buyers: place orders, see order history
  - Sellers: manage incoming orders

- **Real-Time Chat**

  - Private chat rooms per product
  - Socket.IO for instant buyer/seller messaging

- **Responsive Design**

  - Tailwind CSS, separate layouts, mobile-friendly navbars

- **Robust Routing**
  - Protected role-based routes, per-layout 404 pages

---

## 🛠️ Tech Stack

| Layer      | Tech Used                                     |
| ---------- | --------------------------------------------- |
| Frontend   | React, Zustand, React Router, Axios, Tailwind |
| Backend    | Node.js, Express.js, MongoDB (Mongoose), JWT  |
| Real Time  | Socket.IO                                     |
| Auth       | JWT (httpOnly cookies), CORS                  |
| Deployment | Ready for Render, Vercel, or any Node+React   |

---

## ⚡ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/NikhilNaik23/TradeSwift.git
cd TradeSwift
```

Backend dependencies

```bash
npm install
```

Frontend dependencies

```bash
cd frontend
npm install
```

### 2. Environment Variables

#### Backend (`/.env`)

```bash
PORT=5000
MONGO_URI=Mongo_Database_URI
JWT_SECRET=SECRET_KEY
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_secret
NODE_ENV=development
```

#### Frontend (`/frontend/.env`)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Run Development Servers

In separate terminals:

#### Backend (./)

```bash
npm run dev
```

#### Frontend (./frontend/)

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend/API: [http://localhost:5000](http://localhost:5000)

---

## 🌟 Usage

- Register/login via `/login` or `/register`
- Switch role (buyer/seller) from your Profile
- Sellers can manage products and orders; buyers can browse, buy, chat, and manage cart/orders
- Chat in real time per product with other users

---


## 🌐 Deployment

- **Frontend build (`/frontend/dist`) is served by Express in production**
- Set `NODE_ENV=production` and run a production build (`npm run build` in `/`)
- Update CORS and Socket.IO `origin` arrays in backend and in frontend for your deploy URLs 

---

## 🔒 Security

- All sensitive tokens are httpOnly cookies
- Protected role-based routing
- Changing roles and logout have immediate effect

---

## 🤝 Contributions

PRs and issues are welcome! Fork the repo, create a branch, and submit pull requests.

---
## License

MIT License — free for personal and commercial use.

---

**Enjoy TradeSwift: a modern, real-time, role-based marketplace template built for production and learning!**