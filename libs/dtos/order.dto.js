class CreateOrderDto {
  constructor({ userId, product, amount }) {
    this.userId = userId;
    this.product = product;
    this.amount = amount;
  }
}

module.exports = CreateOrderDto;
