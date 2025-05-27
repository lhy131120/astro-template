const axios = require("axios");
const { z } = require("zod");

const EmailSchema = z.string().email({ message: "請輸入有效的電子郵件地址" });

exports.handler = async (event, context) => {
	if (event.httpMethod !== "POST") {
		return {
			statusCode: 405,
			body: JSON.stringify({ error: "方法不允許" }),
		};
	}

	try {
		const { name, email } = JSON.parse(event.body);
		const emailValidation = EmailSchema.safeParse(email);
		if (!emailValidation.success) {
			return {
				statusCode: 400,
				body: JSON.stringify({ error: emailValidation.error.errors[0].message }),
			};
		}

		const nameParts = name.trim().split(" ");
		const attributes = {
			FIRSTNAME: nameParts[0] || "",
			LASTNAME: nameParts.slice(1).join(" ") || "",
		};

		const BREVO_API_KEY = process.env.BREVO_API_KEY;
		const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID, 10);

		await axios.post(
			"https://api.brevo.com/v3/contacts",
			{
				email,
				attributes,
				listIds: [BREVO_LIST_ID],
				updateEnabled: false,
				emailBlacklisted: false,
				smsBlacklisted: false,
			},
			{
				headers: {
					"api-key": BREVO_API_KEY,
					"Content-Type": "application/json",
				},
			}
		);

		return {
			statusCode: 200,
			body: JSON.stringify({ message: "訂閱成功" }),
		};
	} catch (error) {
		console.error("Brevo API 錯誤:", error.response?.data || error.message);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "無法新增訂閱者，請稍後再試" }),
		};
	}
};
