interface ServiceApi {}

interface HttpProxyRequest {
  url: string;
}

interface HttpProxyResponse {
  text: string;
}

// function

// ServiceServer

// ServiceClient.request("/endpoint", payload) =>
//  internally construct "request id" and wait for the response
