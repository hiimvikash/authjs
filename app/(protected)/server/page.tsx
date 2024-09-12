import { currentUser } from "@/lib/getCurrent";
import { UserInfo } from "../_components/user-info";

const ServerPage = async ()=>{

    const user = await currentUser();

    return (
        <div>
          <UserInfo user={user} label="🚆 Server Component"/>
        </div>
    )
}

export default ServerPage;