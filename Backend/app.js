const express = require('express');
const app = express();
const userRouter = require('./router/userRouter');
const purchaseRouter = require('./router/purchaseRouter');

app.use(express.json());

app.use('/user', userRouter);
app.use("/api/purchase", purchaseRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

