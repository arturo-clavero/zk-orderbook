## Contracts used here 
voult contract: https://sepolia.etherscan.io/address/0xb113cf6bfb6dd42e12bd401e22e3e0ea9cdbd1af
##
pyusd contract: https://sepolia.etherscan.io/address/0x9118b7E6f445dfa116984d04222FDC8C5bF27d9D
##
usdt contract:  https://sepolia.etherscan.io/address/0xe89044eeb8a14ce585a17f674d9dd5bcede67bbe
## Project setup
```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## ✨ Glossary

* Personally identifiable information (PII) is information related to confirming an individual's identity. Sensitive PII can include full name, Social Security number, driver's license, financial information, and medical records.

## ✨ High-level architecture (components)

* KYC / Identity Store (KIS) — highly-protected DB/service (encrypted fields, HSM keys). Stores real PII and mapping tokens only.

* Trading Ledger Service (TLS) — stores orders, trades, balances using pseudonymous IDs only (no PII).

* Matching Engine (ME) — matches orders using pseudonyms or blinded order book; runs in the same trust boundary as TLS or within an enclave.

* Settlement / Custody — moves funds; only TLS and custody speak to it.

* Audit & Compliance Interface — one-way, logged access for legal requests; can reveal mapping from pseudonym → identity only after multi-party approval and logged events.

* User-facing UI — shows users only their own balances + aggregated market data (no per-user balances or exact counterparty details).

## two databases 
* ADD IN FUTURE kyc_db (strict) — contains real identity / PII (names, IDs, documents, DOB, KYC evidence). Very sensitive. Access extremely restricted, strongly encrypted, separate network/credentials, and only accessible via a narrow service/API that requires multi-party approval / logging.

* trading_db (pseudonymous) — contains operational trading data (orders, ledger entries, balances) but uses opaque tokens (pseudonymous IDs) instead of PII. This DB is used daily by matching, settlement, and UI services — but it must not contain raw identity data.
* Verifying users via KYC DB (yes/no). Having pseudonymous trading users in Trading DB.Tracking balances, orders, and executed trades.

## prisma - backend ORM
for entering orm 
pnpm prisma studio --schema ./src/lib/prisma-trading-database/schema.prisma
```bash

      #Set up a new local Prisma Postgres `prisma dev`-ready project
      $ prisma init

      #Start a local Prisma Postgres server for development
      $ prisma dev

      #Generate artifacts (e.g. Prisma Client)
      $ prisma generate

      #Browse your data
      $ prisma studio

      #Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
      $ prisma migrate dev

      #Pull the schema from an existing database, updating the Prisma schema
      $ prisma db pull

      #Push the Prisma schema state to the database
      $ prisma db push

      #Validate your Prisma schema
      $ prisma validate

      #Format your Prisma schema
      $ prisma format

      #Display Prisma version info
      $ prisma version

      #Display Prisma debug info
      $ prisma debug
      #to reset
      $ pnpm prisma migrate reset --schema ./src/lib/prisma-trading-database/schema.prisma
      ```
  ##prisma scripts custom scripts:
  ```bash
    postinstall: Runs immediately after installing dependencies to generate Prisma Clients for both the user and post databases using their respective schema files.
    generate: Manually triggers the generation of Prisma Clients for both schemas, ensuring your client code reflects the latest models.
    migrate: Applies pending migrations in development mode for both databases using Prisma Migrate, updating their schemas based on changes in your Prisma files.
    deploy: Executes migrations in a production environment, synchronizing your live databases with your Prisma schemas.
    studio: Opens Prisma Studio for both databases simultaneously on different ports (5555 for the user database and 5556 for the post database) for visual data management.

  ```
  ## Envio commands
  ``` bash
  Run code generation to update types and generated code:

    $ pnpm codegen
      or
    $ pnpx envio codegen

Restart your indexer to apply the new configuration:

    $ pnpm dev
      or
    $ pnpx envio start
```
### TO see logs in envio need to go to envio folder and export those vars
```bash
export TUI_OFF="true"  # Or use --tui-off flag when starting

Log Visibility: To maintain the Terminal UI while capturing detailed logs:

export LOG_STRATEGY="both-prettyconsole"
export LOG_FILE="./debug.log"
```
### Docker create network for envio 
```bash
  $ docker network create envio-shared
```

```
