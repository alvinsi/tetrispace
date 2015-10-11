module.exports = function (sequelize, DataTypes) {
	return sequelize.define('listing', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate:{
				notEmpty: true
			} 
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
}