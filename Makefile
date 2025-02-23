.PHONY: start check test deploy 

start:
	deno run --allow-net --allow-env --watch supabase/functions/telegram-webhook/index.ts

serve:
	supabase functions serve telegram-webhook --no-verify-jwt --env-file .env

ngrok:
	ngrok http 54321

check-format:
	deno fmt --check

check-lint:
	deno lint

check-types:
	deno check --allow-import **/*.ts

format:
	deno fmt

lint-fix:
	deno lint --fix

test:
	deno test --allow-net --allow-env

deploy:
	supabase functions deploy telegram-webhook