const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

//  List of Games and Their IDs
const Game = sequelize.define('Game', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false }, // Use RAWG API ID
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true }, // For unique identification
  genre: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT }, // Decimal rating
  released: { type: DataTypes.DATE }, // Release date
});

// Additional details about a game
//  One-to-one relationship with the Game table
const GameDetails = sequelize.define('GameDetails', {
  gameId: {
    type: DataTypes.INTEGER,
    references: { model: 'Games', key: 'id' }, // Foreign key to Game table
    allowNull: false,
  },
  description: { type: DataTypes.TEXT, allowNull: false },
  platforms: { type: DataTypes.STRING }, // List of platforms (comma-separated)
});

// Images for games
// Each game can have multiple images, one-to-many relationship with the Game table
const GameImage = sequelize.define('GameImage', {
  gameId: {
    type: DataTypes.INTEGER,
    references: { model: 'Games', key: 'id' },
    allowNull: false,
  },
  imageUrl: { type: DataTypes.STRING, allowNull: false }, // URL to the image
  type: { type: DataTypes.STRING, defaultValue: 'cover' }, // Cover, screenshot, etc.
});

// Comments and reviews from users for each game
// Each game can have multiple reviews, one-to-many relationship with the Game table.
const GameReview = sequelize.define('GameReview', {
  gameId: {
    type: DataTypes.INTEGER,
    references: { model: 'Games', key: 'id' },
    allowNull: false,
  },
  userId: { type: DataTypes.INTEGER, allowNull: false, }, // Reference to a User table if needed
  username: { type: DataTypes.STRING, allowNull: false, }, // Name of the reviewer
  comment: { type: DataTypes.TEXT, allowNull: false, },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
});

// User table definition
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Auto-generate IDs for users
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure usernames are unique
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure emails are unique
    validate: { isEmail: true }, // Email format validation
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user'
  }, // Default role is 'user'
  bio: {
    type: DataTypes.TEXT, // Optional user bio
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING, // Optional profile picture URL
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically set to current date
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Automatically set to current date
  },
});


// Defined relationships between these models
Game.hasOne(GameDetails, { foreignKey: 'gameId', as: 'gamedetals' });
GameDetails.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

Game.hasMany(GameImage, { foreignKey: 'gameId', as: 'gameimage' });
GameImage.belongsTo(Game, { foreignKey: 'gameId' });

Game.hasMany(GameReview, { foreignKey: 'gameId', as: 'reviews' });
GameReview.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

User.hasMany(GameReview, { foreignKey: 'userId', onDelete: 'CASCADE' });
GameReview.belongsTo(User, { foreignKey: 'userId' });


// Optional: A many-to-many relationship for favorites or wishlist
User.belongsToMany(Game, { through: 'UserGames', as: 'favorites' });
Game.belongsToMany(User, { through: 'UserGames', as: 'favoritedBy' });

module.exports = { Game, GameDetails, GameImage, GameReview, User };
