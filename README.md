# xFinance

**xFinance** is a mobile finance management application built with **React Native** and **Expo**, designed to help users track their income, expenses, and categories efficiently. The app features transaction management, filtering, charts, and user authentication.

---

## Table of Contents

- [xFinance](#xfinance)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Installation](#installation)
  - [Running the App](#running-the-app)

---

## Project Overview

xFinance provides users with:

- **Transaction Management**: Add, edit, delete transactions.  
- **Filters & Search**: Filter by category, type (income/expense), and search descriptions.  
- **Dashboard Summary**: See total income and expenses.  
- **Charts**: Visual representation of expense distribution.  
- **Authentication**: User login/logout functionality with local storage.

---

## Features

- Add, edit, and delete transactions.  
- Categorize transactions as **income** or **expense**.  
- Filter by **category**, **type**, and **date range**.  
- Summary of total **income** and **expenses**.  
- Responsive **charts** for category-based expense tracking.  
- Clean **Tailwind CSS** styling for mobile.  

---

## Tech Stack

- **React Native**  
- **Expo**  
- **React Navigation**  
- **React Hook Form** + **Yup** (form validation)  
- **Tailwind CSS** (via `tailwindcss-react-native`)  
- **Lucide Icons**  
- **AsyncStorage** (local storage)  
- **JavaScript (ES6)**  

---

## Project Structure

XFinance/
├── App.js
├── package.json
├── tailwind.config.js
├── src/
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── TransactionController.js
│   │   └── DashboardController.js
│   ├── views/
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── TransactionsScreen.js
│   │   │   ├── AddTransactionScreen.js
│   │   │   └── SettingsScreen.js
│   │   └── components/
│   │       ├── TransactionCard.js
│   │       ├── DashboardChart.js
│   │       └── CustomInput.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── services/
│   │   ├── ApiService.js
│   │   └── StorageService.js
│   └── utils/
│       ├── constants.js
│       └── helpers.js

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/RayaneChCh-dev/XFinance

cd XFinance
```


```bash
yarn install
or
npm install
```

```bash
npm install -g expo-cli
```
---
## Running the App

1. Start the Expo development server:

```bash
npx expo start
```

2. Run the app on Android or iOS simulator, or scan the QR code with your Expo Go app.

---