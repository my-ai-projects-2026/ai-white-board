"use client";
import { UserDetailContext } from "@/context/user-detail-context";
import { User } from "@/db/models/user";
import { ReactNode, useEffect, useState } from "react";

const Provider = ({children} : {children:ReactNode}) => {

	const [userDetail,setUserDetail] = useState<User>();
	const [userError,setUserError] = useState<string>();

	useEffect(() => {
		let ignore = false;

		const createNewUser = async () => {

			try {
				const httpFetchResult = await fetch("/api/users",{
					method: "post",
					headers: {
						"content-type": "application/json"
					}
				});

				if (!httpFetchResult.ok) {
					throw new Error(`Failed to fetch user: ${httpFetchResult.status}`);
				}

				const data = await httpFetchResult.json() as User;

				if (!ignore) {
					setUserDetail(data);
				}
			} catch (error) {
				console.error(error);
				if (!ignore) {
					setUserError(error instanceof Error ? error.message : "Failed to load user");
				}
			}

		}

		createNewUser();

		return () => {
			ignore = true;
		};
	},[])

  return (
	<UserDetailContext.Provider value={{userDetail, setUserDetail, userError}}>
		<div>
		{children}
		</div>
	</UserDetailContext.Provider>

	);
};
export default Provider;
