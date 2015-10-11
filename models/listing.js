module.exports = function (sequelize, DataTypes) {
	return sequelize.define('listing', {
		CapitalOneId: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Address: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Price: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Height: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Width: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Length: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Phone: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Latitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		Longitude: {
			type: DataTypes.FLOAT,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		StartMonth: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		EndMonth: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
	});
}