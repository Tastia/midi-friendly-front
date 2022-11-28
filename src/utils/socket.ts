import { getSession } from 'next-auth/react';
import { io } from 'socket.io-client';

export default (async () => {
	const session = await getSession();
	if (session === null) {
		return;
	}
	const socketOptions = {
		transportOptions: {
			polling: {
				extraHeaders: {
					Authorization: `Bearer ${session.user.token}`,
					organizationId: session.user.organizationID,
				},
			},
		},
	};
	return io('localhost:8080', socketOptions);
})();
