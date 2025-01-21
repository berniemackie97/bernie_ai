import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    // Query the database to check if a user with the given email already exists
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    // If no user is found, insert the new user into the database
    if (user?.length == 0) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        uid: args.uid,
      });
      console.log(result);
    }
  },
});

// Query to get a user by email
export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Query the database to find a user with the given email
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0];
  },
});
