#!/bin/bash
# setup-mongodb.sh - Choose your MongoDB setup option

echo "🍃 MongoDB Setup for SkillShare Project"
echo "======================================="
echo ""
echo "Choose your MongoDB setup option:"
echo ""
echo "1) 🏠 Local MongoDB (install on your computer)"
echo "2) ☁️  MongoDB Atlas (cloud - recommended)"  
echo "3) 🐳 Docker MongoDB (easiest for development)"
echo "4) 📚 Just show me the connection strings"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "🏠 Setting up Local MongoDB..."
    echo ""
    echo "For macOS:"
    echo "brew tap mongodb/brew"
    echo "brew install mongodb-community"
    echo "brew services start mongodb-community"
    echo ""
    echo "For Ubuntu:"
    echo "sudo apt-get install mongodb"
    echo "sudo systemctl start mongodb"
    echo ""
    echo "Your .env.local should have:"
    echo "MONGODB_URI=mongodb://localhost:27017/skillshare"
    ;;
    
  2)
    echo ""
    echo "☁️ Setting up MongoDB Atlas..."
    echo ""
    echo "1. Go to https://www.mongodb.com/cloud/atlas"
    echo "2. Create a free account"
    echo "3. Create a new cluster (free tier)"
    echo "4. Create a database user"
    echo "5. Add your IP address to whitelist"
    echo "6. Get your connection string"
    echo ""
    echo "Your .env.local should have:"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skillshare"
    echo ""
    echo "✅ This is the RECOMMENDED option for beginners!"
    ;;
    
  3)
    echo ""
    echo "🐳 Setting up Docker MongoDB..."
    echo ""
    echo "Run this command:"
    echo "docker run -d -p 27017:27017 --name skillshare-mongo mongo:latest"
    echo ""
    echo "Your .env.local should have:"
    echo "MONGODB_URI=mongodb://localhost:27017/skillshare"
    echo ""
    echo "To stop: docker stop skillshare-mongo"
    echo "To start: docker start skillshare-mongo"
    ;;
    
  4)
    echo ""
    echo "📚 MongoDB Connection String Examples:"
    echo ""
    echo "Local MongoDB:"
    echo "MONGODB_URI=mongodb://localhost:27017/skillshare"
    echo ""
    echo "MongoDB Atlas:"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/skillshare"
    echo ""
    echo "Docker MongoDB:"
    echo "MONGODB_URI=mongodb://localhost:27017/skillshare"
    echo ""
    echo "MongoDB with authentication:"
    echo "MONGODB_URI=mongodb://username:password@localhost:27017/skillshare"
    ;;
    
  *)
    echo "Invalid choice. Please run the script again."
    ;;
esac

echo ""
echo "📝 Next steps:"
echo "1. Update your .env.local with the MongoDB URI"
echo "2. Run: npm run seed (to add sample data)"
echo "3. Test your app at http://localhost:3000"
echo ""
echo "🎉 Happy coding!"