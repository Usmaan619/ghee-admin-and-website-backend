const moment = require("moment/moment");
const { withConnection } = require("../utils/helper");

// Get total users for a specific month
exports.getMonthlyUserCount = async (month, year) => {
  try {
    // Calculate start and end dates of the specified month
    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT COUNT(*) AS total_users 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getMonthlyUserCount:", error);
    throw error;
  }
};

// Get total sales for a specific month
exports.getMonthlyTotalSales = async (month, year) => {
  try {
    // Calculate start and end dates of the specified month
    const startOfMonth = moment(`${year}-${month}-01`)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endOfMonth = moment(`${year}-${month}-01`)
      .endOf("month")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT SUM(user_total_amount) AS total_sales 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getMonthlyTotalSales:", error);
    throw error;
  }
};

// Get user count for a specific week
exports.getWeeklyUserCount = async (week, year) => {
  try {
    // Calculate start and end dates of the specified week
    const startOfWeek = moment()
      .year(year)
      .week(week)
      .startOf("week")
      .format("YYYY-MM-DD");
    const endOfWeek = moment()
      .year(year)
      .week(week)
      .endOf("week")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT COUNT(*) AS total_users 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [startOfWeek, endOfWeek]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getWeeklyUserCount:", error);
    throw error;
  }
};

// Get total sales for a specific week
exports.getWeeklyTotalSales = async (week, year) => {
  try {
    // Calculate start and end dates of the specified week
    const startOfWeek = moment()
      .year(year)
      .week(week)
      .startOf("week")
      .format("YYYY-MM-DD");
    const endOfWeek = moment()
      .year(year)
      .week(week)
      .endOf("week")
      .format("YYYY-MM-DD");

    return await withConnection(async (connection) => {
      const query = `
        SELECT SUM(user_total_amount) AS total_sales 
        FROM organic_farmer_table_payment
        WHERE DATE BETWEEN ? AND ?;
      `;
      const [rows] = await connection.execute(query, [startOfWeek, endOfWeek]);
      return rows[0];
    });
  } catch (error) {
    console.error("Error in getWeeklyTotalSales:", error);
    throw error;
  }
};

exports.getAllTotalSalesMonthlyData = async () => {
  try {
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");

    const result = await withConnection(async (connection) => {
      const query = `
        SELECT
          COUNT(*) AS total_users,
          SUM(user_total_amount) AS total_amount_collected
        FROM
          organic_farmer_table_payment
        WHERE
          DATE BETWEEN ? AND ?;
      `;

      const [results] = await connection.execute(query, [
        startOfMonth,
        endOfMonth,
      ]);

      return results[0] || { total_users: 0, total_amount_collected: 0 };
    });

    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("Error in getAllTotalSalesMonthlyData:", error);
    throw error;
  }
};

exports.getWeeklyMonthlySixMonthlyData = async () => {
    try {
      // Calculate current week range
      const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
      const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");
  
      // Calculate current month range
      const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
  
      // Calculate last six months range
      const startOfSixMonths = moment().subtract(6, "months").startOf("month").format("YYYY-MM-DD");
      const endOfSixMonths = moment().endOf("month").format("YYYY-MM-DD");
  
      return await withConnection(async (connection) => {
        // Query for weekly data
        const weeklyQuery = `
          SELECT 
            COUNT(*) AS weekly_total_users, 
            SUM(user_total_amount) AS weekly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;
  
        // Query for monthly data
        const monthlyQuery = `
          SELECT 
            COUNT(*) AS monthly_total_users, 
            SUM(user_total_amount) AS monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;
  
        // Query for last six months' data
        const sixMonthlyQuery = `
          SELECT 
            COUNT(*) AS six_monthly_total_users, 
            SUM(user_total_amount) AS six_monthly_total_sales
          FROM organic_farmer_table_payment
          WHERE DATE BETWEEN ? AND ?;
        `;
  
        // Execute all queries in parallel
        const [[weeklyData], [monthlyData], [sixMonthlyData]] = await Promise.all([
          connection.execute(weeklyQuery, [startOfWeek, endOfWeek]),
          connection.execute(monthlyQuery, [startOfMonth, endOfMonth]),
          connection.execute(sixMonthlyQuery, [startOfSixMonths, endOfSixMonths]),
        ]);
  
        return {
          week: { start: startOfWeek, end: endOfWeek, data: weeklyData[0] },
          month: { start: startOfMonth, end: endOfMonth, data: monthlyData[0] },
          sixMonths: { start: startOfSixMonths, end: endOfSixMonths, data: sixMonthlyData[0] },
        };
      });
    } catch (error) {
      console.error("Error in getWeeklyMonthlySixMonthlyData:", error);
      throw error;
    }
  };
  