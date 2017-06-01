package org.opengeoportal.harvester.api.metadata.model;

import java.net.URL;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Info about metadata location field.
 *
 * @author <a href="mailto:juanluisrp@geocat.net">Juan Luis Rodríguez</a>.
 * @author Chris S. Barnett.
 *
 */
public class LocationLink {
    /** Location types (WMS, WFS, WCS, ...). Each */
    public static enum LocationType {
        /** Location type WMS.It's an array. */
        wms(true),
        /** WFS location type. It is NOT an array. */
        wfs(false),
        /** WCS location type. It is NOT an array. */
        wcs(false),
        /** Tilecache location type. It's an array. */
        tilecache(true),
        /** Image collection location type. It is NOT an array. */
        imageCollection(false),
        /** ArcGIS REST location type. It is NOT an array. */
        ArcGISRest(false),
        /** Browse Graphic location type. It is NOT an array. */
        browseGraphic(false),
        /** Service start location type. It is NOT an array. */
        serviceStart(false),
        // zipFile,
        /** Map record location type. It is NOT an array. */
        mapRecord(false),
        /** Lib record location type. It is NOT an array. */
        libRecord(false),
        /** File download location type. It's an array. */
        fileDownload(true),
        /** Download location type. It is NOT an array. */
        download(false);

        /**
         * Build a LocationType based on the passed String. If the string passed
         * contains a name of a LocationType, this location type is returned.
         * 
         * @param locationTypeString
         *            the string to parse.
         * @return a {@link LocationType} built
         * @throws Exception
         *             if the location type can not be resolved.
         */
        public static LocationType fromString(final String locationTypeString)
                throws Exception {
            for (final LocationType locType : LocationType.values()) {
                if (locationTypeString.toLowerCase()
                        .contains(locType.toString().toLowerCase())) {
                    return locType;
                }
            }
            throw new Exception("LocationType could not be resolved from: '"
                    + locationTypeString + "'");
        }

        /** Is the location type an array? */
        private final Boolean isArray;

        /**
         * LocationType constructor.
         * 
         * @param isArray
         *            <code>true</code> if the build location type can be an
         *            array, <code>false</code> otherwise.
         */
        LocationType(final Boolean isArray) {
            this.isArray = isArray;
        }

        /**
         * @return the isArray
         */
        public Boolean getIsArray() {
            return this.isArray;
        }
    }

    /** The logger. */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    /** The location type. */
    private final LocationType locationType;
    /** The URL. */
    private URL url;
    /** The resouce name. */
    private String resourceName;

    /**
     * Create a new LocationLink.
     * 
     * @param locationType
     *            the type.
     * @param url
     *            the location URL.
     */
    public LocationLink(final LocationType locationType, final URL url) {
        this.locationType = locationType;
        this.setUrl(url);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("LocationType: " + locationType.toString());
            this.logger.debug("URL: " + url.toString());
        }
    }

    /**
     * @return the locationType
     */
    public LocationType getLocationType() {
        return this.locationType;
    }

    /**
     * @return the resourceName
     */
    public String getResourceName() {
        return this.resourceName;
    }

    /**
     * @return the url
     */
    public URL getUrl() {
        return this.url;
    }

    /**
     * @param resourceName
     *            the resourceName to set
     */
    public void setResourceName(final String resourceName) {
        this.resourceName = resourceName;
    }

    /**
     * @param url
     *            the url to set
     */
    public void setUrl(final URL url) {
        this.url = url;
    }

    /**
     * Return a string object representation in this way:
     * <ul>
     * <li>If {@link LocationType} is an array:
     * <code>"locationType":["url"]</code>.
     * <li>If {@link LocationType} is NOT an array:
     * <code>"locationType": "url"</code></li>
     * </ul>
     * 
     * @return the object as string.
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        if (this.getLocationType().getIsArray()) {
            return "\"" + this.getLocationType().toString() + "\": [\""
                    + this.getUrl().toString() + "\"]";
        } else {
            return "\"" + this.getLocationType().toString() + "\": \""
                    + this.getUrl().toString() + "\"";
        }
    }

}
