const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  const expiresAt = new Date(
    Date.now() + process.env.COOKIEEXPIRESTIME * 24 * 60 * 60 * 1000
  );
  const options = {
    expires: expiresAt,
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",

    //for development set secure to false and sameSite to lax and for production set secure to true and sameSite to none
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    expiresAt,
    user,
  });
};

export { sendToken };
