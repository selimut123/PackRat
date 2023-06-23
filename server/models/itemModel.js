import mongoose from "mongoose";
import myDB from "./dbConnection.js";

const { Schema } = mongoose;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    weight: { type: Number },
    originalWeight: { type: Number },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true },
    isFood: { type: Boolean, default: false },
    isWater: { type: Boolean, default: false },
    owners: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    packs: [{ type: Schema.Types.ObjectId, ref: "Pack", default: [] }],
    createdAt: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getters for weight conversions
ItemSchema.virtual("weightInGrams").get(function () {
  if (this.unit === "lb") {
    return this.originalWeight * 453.59237; // Convert pounds to grams
  } else if (this.unit === "kg") {
    return this.originalWeight * 1000; // Convert kilograms to grams
  } else if (this.unit === "oz") {
    return this.originalWeight * 28.34952; // Convert ounces to grams
  } else {
    return this.originalWeight; // Assume weight is already in grams if unit is not recognized
  }
});

ItemSchema.virtual("weightInPounds").get(function () {
  if (this.unit === "kg") {
    return this.originalWeight * 2.20462; // Convert kilograms to pounds
  } else if (this.unit === "oz") {
    return this.originalWeight * 0.0625; // Convert ounces to pounds
  } else if (this.unit === "g") {
    return this.originalWeight * 0.00220462; // Convert grams to pounds
  } else {
    return this.originalWeight; // Assume weight is already in pounds if unit is not recognized
  }
});

ItemSchema.virtual("weightInKilograms").get(function () {
  if (this.unit === "lb") {
    return this.originalWeight * 0.453592; // Convert pounds to kilograms
  } else if (this.unit === "oz") {
    return this.originalWeight * 0.0283495; // Convert ounces to kilograms
  } else if (this.unit === "g") {
    return this.originalWeight * 0.001; // Convert grams to kilograms
  } else {
    return this.originalWeight; // Assume weight is already in kilograms if unit is not recognized
  }
});

ItemSchema.virtual("weightInOunces").get(function () {
  if (this.unit === "lb") {
    return this.originalWeight * 16; // Convert pounds to ounces
  } else if (this.unit === "kg") {
    return this.originalWeight * 35.274; // Convert kilograms to ounces
  } else if (this.unit === "g") {
    return this.originalWeight * 0.035274; // Convert grams to ounces
  } else {
    return this.originalWeight; // Assume weight is already in ounces if unit is not recognized
  }
});

// Helper function to convert weight to grams
function convertWeightToGrams(weight, unit) {
  if (unit === "lb") {
    // Convert pounds to grams: 1 pound = 453.59237 grams
    return weight * 453.59237;
  } else if (unit === "kg") {
    // Convert kilograms to grams: 1 kilogram = 1000 grams
    return weight * 1000;
  } else if (unit === "oz") {
    // Convert ounces to grams: 1 ounce = 28.34952 grams
    return weight * 28.34952;
  } else {
    return weight; // Assume weight is already in grams if unit is not recognized
  }
}

ItemSchema.pre("save", function (next) {
  this.originalWeight = this.weight; // Store the original weight
  this.weight = convertWeightToGrams(this.weight, this.unit); // Convert weight to grams
  next();
});

const Item = myDB.model("Item", ItemSchema);
export default Item;
