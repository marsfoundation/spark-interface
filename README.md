# Spark Protocol Interface

An open source interface for the decentralized liquidity protocol Spark

Enabling users to:

- Manage and monitor their positions on the Spark Protocol, and the overall status of it

## How to use

Install it and run:

```sh
cp .env.example .env.local
yarn
yarn dev
```

## Contribution

For instructions on local development, deployment, configurations & feature proposals, see [Contributing](./CONTRIBUTING.md)

## IPFS deployment

Each commit gets deployed to IPFS automatically

There's a github action commenting the appropriate IPFS hash embedded in the Cloudflare IPFS gateway after each commit

For ease of use:

- the DNS of [https://app.sparkprotocol.io](https://app.sparkprotocol.io) will always point to the latest `spark` IPFS hash with disabled test networks

### Troubleshooting

Issue: I cannot connect to `app.sparkprotocol.io`

The spark-interface is hosted on IPFS in a decentralized manner. `app.sparkprotocol.io` just holds a CNAME record to the Cloudflare IPFS gateway. You can use [any](https://ipfs.github.io/public-gateway-checker/) public or private IPFS gateway supporting origin isolation to access spark-interface if for some reason the Cloudflare gateway doesn't work for you

Just go to `<your favorite public ipfs gateway>/ipns/app.sparkprotocol.io`

⚠️ Make sure the gateway supports origin isolation to avoid possible security issues: you should be redirected to URL that looks like `https://app-sparkprotocol-io.<your gateway>`

## License

[BSD-3-Clause](./LICENSE.md)

## Credits

To all the Ethereum community

## Plug and Play License

This code is open source, but use within a Maker SubDAO requires a 15% revenue share of all income generated by the usage of code inside this repository to the Ethereum address labelled by the ENS domain of sparkprotocol.eth. This Plug and Play revenue share license expires on January 1st, 2026 at 00:00 UTC.

***
*The IP in this repository was assigned to Mars SPC Limited in respect of the MarsOne SP*
