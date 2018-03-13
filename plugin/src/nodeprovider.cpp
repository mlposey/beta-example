#include <iostream>
#include <vector>
#include <sstream>
#include <boost/dll/alias.hpp>
#include "../external/nlohmann/json.hpp"
#include "../external/curlpp/cURLpp.hpp"
#include "../external/curlpp/Easy.hpp"
#include "../external/curlpp/Options.hpp"
#include "../external/curlpp/Infos.hpp"
#include "pathprovider.h"

using std::string;
using std::vector;

/** Forwards requests to the Node.js path API and returns formatted results */
class NodeProvider : public PathProvider {
public:
    string name() const { return "Node Provider"; }
    float version() const { return 0.1; }
    string author() const { return "developer@example.com"; }

    vector<float> findPath(float srcLat, float srcLng, float dstLat, float dstLng) {
        try {
            string reqBody = buildRequestBody(srcLat, srcLng, dstLat, dstLng);
            string resBody = sendRequest(reqBody);
            return parseResponse(resBody);
        } catch (std::exception &e) {
            std::cout << e.what() << '\n';
            return {};
        }
    }

private:
    /** Creates the request body to send to the path service */
    string buildRequestBody(float srcLat, float srcLng, float dstLat, float dstLng);
    /** Sends a path request to the path service */
    string sendRequest(string body);
    /** Configures the request to match the expected service format */
    void configureRequest(std::stringstream &writer, string body, curlpp::Easy &request);    
    /** Converts the service response to the format expected by the cache */
    vector<float> parseResponse(string body);
};

inline string NodeProvider::buildRequestBody(float srcLat, float srcLng, float dstLat, float dstLng) {
    return nlohmann::json{
        {"src", {
            {"x", srcLat},
            {"y", srcLng}
        }},
        {"dst", {
            {"x", dstLat},
            {"y", dstLng}
        }}
    }.dump();
}

inline string NodeProvider::sendRequest(string body) {
    curlpp::Easy request;
    std::stringstream response;
    configureRequest(response, body, request);
    request.perform();

    if (curlpp::infos::ResponseCode::get(request) != 200) {
        std::cout << "Request failed.\n"
                  << "Request body:\n"
                  << body << "\n--\n"
                  << "Response body:\n"
                  << response.str() << "\n--\n";
        throw std::runtime_error("path not found");
    }
    return response.str();
}

inline void NodeProvider::configureRequest(std::stringstream &writer, string body, curlpp::Easy &request) {
    request.setOpt(curlpp::options::WriteStream(&writer));
    request.setOpt(new curlpp::options::Url("http://localhost:8080/v1/paths"));
    request.setOpt(new curlpp::options::PostFields(body));
    std::list<string> headers{"Content-Type: application/json"};
    request.setOpt(new curlpp::options::HttpHeader(headers));
}

inline vector<float> NodeProvider::parseResponse(string body) {
    vector<float> path;
    nlohmann::json obj = nlohmann::json::parse(body);
    for (auto &point : obj["path"]) {
        path.push_back(point["x"]);
        path.push_back(point["y"]);
    }
    return path;
}

extern "C" BOOST_SYMBOL_EXPORT NodeProvider provider;
NodeProvider provider;
