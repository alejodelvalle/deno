// 'dashportConfig.ts' file
import GoogleStrategy from 'https://deno.land/x/dashport_google/mod.ts';
import GitHubStrategy from 'https://deno.land/x/dashport_github/mod.ts';

export const googStrat = new GoogleStrategy({
	client_id: '841165938689-727m2d44010puf3ud03j8j3lp73brq38.apps.googleusercontent.com',
	client_secret: 'fl_5OMic8CSyiKt2wnbIumga',
	redirect_uri: 'http://localhost:8000/v1/auth/google/callback',
	response_type: 'code',
	scope: 'profile email openid',
	grant_type: 'authorization_code'
});

export const ghStrat = new GitHubStrategy({
	client_id: 'client-id-here',
	client_secret: 'client-secret-here',
	redirect_uri: 'http://localhost:8000/privatepage'
});

export const serializerA = async (userInfo: any) => {
	const serializedId = Math.floor(Math.random() * 1000000000);
	userInfo.id = serializedId;

	try {
		//await exampleDbCreateUpsert(userInfo);
		return serializedId;
	} catch (err) {
		return err;
		// or return new Error(err);
	}
};

export const deserializerA = async (serializedId: string | number) => {
	try {
		const userInfo = 12; //await exampleDbFind({ id: serializedId });
		return userInfo;
	} catch (err) {
		return err;
		// or return new Error(err);
	}
};
