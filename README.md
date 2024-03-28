# Currency Converter

A simple currency converter application that allows users to convert between different currencies.

## Trade-offs

As this is not a production-ready application, there are some trade-offs that were made:

- the application does not have authN/authZ, rate-limiting, proper logging, monitoring, healthchecks, CI/CD, Git hooks etc.
- structure could be shifted to more of a DDD approach in a real-world product under active development

## Project Structure

The main logic of the service is located in [currency-conversion.service.ts](src/currency-conversion/currency-conversion.service.ts). The control flow of handling conversion requests is:

```txt
currency-conversion.controller.ts ->
currency-conversion.service.ts ->
exchange-rate.provider.module.ts
```

`exchange-rate.provider.module.ts` is responsible for fetching exchange rates from the external API. The service uses a cache provider to store the exchange rates and the converted amounts. The cache provider can be either Redis or an in-memory cache. It is written in a way that it can be easily extended to support other exchange rate providers.

`common/ports` contain the interfaces that are used to define the contracts for exchange rate providers and cache providers. Those interfaces are implemented in `exchange-rate-providers` and `cache`.

## Installation

1. Clone the repository:
   
   ```sh
    git clone https://github.com/papasasha42/currency-converter.git
   ```
   
3. Open the project directory:
   
   ```sh
    cd currency-converter
   ```
   
5. Install the required dependencies:
   ```sh
    npm install
   ```

## Usage

1. Copy `.env.example` to `.env`

   ```sh
    cp .env.example .env 
   ```

2. Decide which caching provider to use:
   1. For Redis run `docker compose up -d` and set `CACHE_PROVIDER=redis` in `.env`
   2. For in-memory cache set `CACHE_PROVIDER=memory` in `.env` (no docker-compose needed)
3. Run the application:

   ```sh
   npm start
   ```

4. Query the `/convert` endpoint with the following parameters:

   ```sh
   curl -X POST http://localhost:3000/v1/currencies/convert \
      -H "Content-Type: application/json" \
      -d '{"sourceCurrency": "USD", "targetCurrency": "UAH", "amount": 100}'
   ```

5. The converted amount will be displayed on the screen:

   ```json
   {
      "data": {
        "convertedAmount": 3918,
        "fromCache": true
      }
   }
   ```

   Errors have the following format (see more examples in [test/app.e2e-spec.ts](test/app.e2e-spec.ts)):

   ```typescript
   {
      error: string;
      status: number;
      message?: string | string[];
   }
   ```

## Testing

To run unit tests, use the following command:

```sh
npm test
```

To run integration tests, use the following command:

```sh
npm run test:e2e
```

## License

This project is licensed under the [MIT License](LICENSE).
