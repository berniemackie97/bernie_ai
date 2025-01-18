import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
  args: {
    messages: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workspaceID = await ctx.db.insert("workspace", {
      messages: args.messages,
      user: args.user,
    });
    return workspaceID;
  },
});

export const GetWorkspace = query({
  args:{
    workspaceID: v.id("workspace")
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.get(args.workspaceID);
    return result;
  },
})