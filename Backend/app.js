const express = require('express');
const app = express();
const userRouter = require('./router/userRouter');
const purchaseRouter = require('./router/purchaseRouter');
const reconciliationRoutes = require('./router/reconciliationRouter');

app.use(express.json());

app.use('/user', userRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/reconcile", reconciliationRoutes);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

