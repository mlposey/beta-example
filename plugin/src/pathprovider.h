#pragma once
#include <string>
#include <vector>

/**
 * Describes the interface for path provider plugins
 * 
 * Classes that implement the PathProvider interface should ideally perform
 * as little computation as possible. I.e., a PathProvider is not a computational
 * engine but a querying one. Complex path finding logic should exist in
 * another service that returns results which are quickly interpreted here.
 * 
 * Implementations libraries must export a PathProvider variable using BOOST_SYMBOL_EXPORT. The
 * name of the variable must be "provider";
 * E.g., given an implementation MyPathProvider the file may look like the following:
 * 
        #include <boost/dll/alias.hpp>
        #include "pathprovider.h"

        class MyPathProvider : public PathProvider {
        public:
            std::string name() const { return "My Path Provider"; }
            float version() const { return 1.0; }
            std::string author() const { return "Me - me@example.com"; }

            std::vector<float> findPath(float srcLat, float srcLng, float dstLat, float dstLng) {
                Query external path-finding engine and return result...
            }
        };

        extern "C" BOOST_SYMBOL_EXPORT MyPathProvider provider;
        MyPathProvider provider;
 * 
 * @version 0.1
 */
struct PathProvider {
    virtual ~PathProvider() = default;

    /** Should return the name of this plugin/provider */
    virtual std::string name() const = 0;
    /** Should return the provider version */
    virtual float version() const = 0;
    /**
     * Should return the name of the provider author
     * 
     * This does not have to be a birth name. References to a means of
     * contact - such as an email, company name, or website handle - are
     * preferred.
     */
    virtual std::string author() const = 0;

    /**
     * Should find a path from the source coordinate to the destination or
     * return an empty vector if one does not exist
     * 
     * The returned vector should contain the latitude and longitude of each
     * node in the path from the origin to the destination. E.g., given a
     * query that is resolved by the path
     *              (3.0, 9.0) -> (5.0, 10.0) -> (4.0, 6.0)
     * the corresponding vector should contain the values
     *              [3.0, 9.0, 5.0, 10.0, 4.0, 6.0]
     */
    virtual std::vector<float> findPath(float srcLat, float srcLng, float dstLat, float dstLng) = 0;
};
