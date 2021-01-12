# **Tracser**

realtracs.com scraper that alerts when new search results are found

## **Getting Started**

### Prerequisites and Environment Setup

Tracser runs on nodejs. Ideally it runs on a dedicated server but it can be used anywhere the node runtime exists, such as your PC. In addition to node, you should have the following setup:

- AWS accesss
- AWS SNS Topic with appropriate permissions (allow sends from "realtracser")
- A realtracs search URL with the results you're interested in acting upon

## **Usage**

To use Tracser, set the following environment variables:

  1. REALTRACS_SEARCH_URL - The URL you'd like to crawl
  1. AMAZON_ACCESS_KEY_ID - AWS access key id
  1. AMAZON_SECRET_ACCESS_KEY - AWS secret key
  1. AWS_SNS_TOPIC_ARN - The SNS topic to be used for sending SMS messages

Once set, invoke the `tracser.js` file as shown below to start the process:

````js
INITIALIZE=false; node tracser.js
````

## **License**

This software is provided under the [MIT License](https://opensource.org/licenses/MIT)
