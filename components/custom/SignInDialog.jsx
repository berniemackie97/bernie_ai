import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";

function SignInDialog({ openDialog, dialogState }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } }
      );

      console.log(userInfo);
      const user = userInfo.data;
      await CreateUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        uid: uuid4()
      });


      if(typeof window !== "undefined") {
        localStorage.setItem("userDetail", JSON.stringify(user));
      }

      setUserDetail(userInfo?.data);
      // Save this inside db
      dialogState(false);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <Dialog open={openDialog} onOpenChange={dialogState}>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center justify-center gap-3">
          <DialogTitle className="font-bold text-2xl text-white">
            {Lookup.SIGNIN_HEADING}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center">
            {Lookup.SIGNIN_SUBHEADING}
          </DialogDescription>
          <Button
            onClick={googleLogin}
            className="bg-blue-500 text-white hover:bg-blue-400 mt-3"
          >
            Sign In With Google
          </Button>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {Lookup?.SIGNIN_AGREEMENT_TEXT}
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
