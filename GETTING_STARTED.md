## 🛠️ Getting Started

### 📦 Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 🐳 Start Required Services

We use Docker Compose to spin up **Keycloak** and **MongoDB**:

```bash
docker compose up
# or to run in background
docker compose up -d
```

---

## 🧪 Backend Setup (Node.js + TypeScript)

```bash
cd server
npm install
npm install -g typescript nodemon
```

> ⚠️ Alternatively, you can install TypeScript and Nodemon as dev dependencies:
```bash
npm install --save-dev typescript nodemon
```

Rename the `.sample-env` file to `.env` and configure the variables.

---

### 📧 SMTP Setup (Google App Password)

To enable email notifications (e.g., verification codes), generate a Google App Password:

🔐 **How to generate App Password for Gmail SMTP:**
- 📖 [Official Google Documentation](https://support.google.com/mail/answer/185833?hl=en)
- 📺 [YouTube Tutorial](https://www.youtube.com/watch?v=uv3W9QEz6xE)

Update `.env`:
```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_generated_app_password
```

---

## 🛡️ Keycloak Setup

Visit the admin console:
```
http://localhost:8080/admin
```
- Username: `admin`
- Password: `admin`

---

### ✅ Enable User Registration

In the **Master Realm Settings**:
1. Go to `Realm Settings` > `Login`
2. Enable **User registration**

---

### 🧑‍💻 Create a New Client

1. Go to `Clients` > `Create client`
2. **Client ID**: `whiteboard-client`
3. Click *Next*, then *Save*

Use the settings below:

| Field | Value |
|---|---|
| Root URL | `http://localhost:5173` |
| Home URL | `http://localhost:5173` |
| Valid redirect URIs | `http://localhost:5173/*` |
| Valid post logout redirect URIs | `http://localhost:5173/*` |
| Web origins | `http://localhost:5173` |
| Admin URL | `http://localhost:5173/admin` |

> ![Keycloak Access Settings](./docker/keycloak_access_settings.png)

---

### ▶️ Run Backend

To run in dev mode:
```bash
npm run dev
```

To build and run the compiled app:
```bash
tsc
node dist/index.js
```

---

## 🎨 Frontend Setup (React + TypeScript)

```bash
cd ts_client
npm install
npm run dev
```

---

### 🚀 App is Live!

Open your browser and navigate to:
```
http://localhost:5173
```

You're all set! 🎉


