import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateWorkspace = mutation({
  args: {
    messages: v.any(),
    user: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Insert a new workspace into the "workspace" collection
    const workspaceID = await ctx.db.insert("workspace", {
      messages: args.messages,
      user: args.user,
    });
    return workspaceID;
  },
});

// Query to get a workspace by its ID
export const GetWorkspace = query({
  args: {
    workspaceID: v.id("workspace"),
  },
  handler: async (ctx, args) => {
    // Get the workspace document from the "workspace" collection
    const result = await ctx.db.get(args.workspaceID);
    return result;
  },
});

export const UpdateMessages = mutation({
  args: {
    workspaceID: v.id("workspace"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    // Update the messages field in the workspace document
    const result = await ctx.db.patch(args.workspaceID, {
      messages: args.messages,
    });
    return result;
  },
});

export const UpdateFiles = mutation({
  args: {
    workspaceID: v.id("workspace"),
    files: v.any(),
  },
  handler: async (ctx, args) => {
    // Update the fileData field in the workspace document
    const result = await ctx.db.patch(args.workspaceID, {
      fileData: args.files,
    });
    return result;
  },
});
