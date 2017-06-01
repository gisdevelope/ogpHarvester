/*
 * IngestListItem.java
 *
 * Copyright (C) 2013
 *
 * This file is part of Open Geoportal Harvester
 *
 * This software is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option) any
 * later version.
 *
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this library; if not, write to the Free Software Foundation, Inc., 51
 * Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 *
 * As a special exception, if you link this library with other files to produce
 * an executable, this library does not by itself cause the resulting executable
 * to be covered by the GNU General Public License. This exception does not
 * however invalidate any other reasons why the executable file might be covered
 * by the GNU General Public License.
 *
 * Authors:: Juan Luis Rodriguez Ponce (mailto:juanluisrp@geocat.net)
 */
package org.opengeoportal.harvester.mvc.bean;

import java.util.Date;

import org.opengeoportal.harvester.api.domain.Ingest;
import org.opengeoportal.harvester.api.domain.IngestCsw;
import org.opengeoportal.harvester.api.domain.IngestFileUpload;
import org.opengeoportal.harvester.api.domain.IngestGeonetwork;
import org.opengeoportal.harvester.api.domain.IngestJobStatus;
import org.opengeoportal.harvester.api.domain.IngestJobStatusValue;
import org.opengeoportal.harvester.api.domain.IngestOGP;
import org.opengeoportal.harvester.api.domain.IngestWebDav;
import org.opengeoportal.harvester.api.domain.InstanceType;

/**
 * @author jlrodriguez
 *
 */
public class IngestListItem {
    private final Ingest ingest;
    private Date nextRun;
    private boolean inProgress = false;
    private final IngestJobStatus status;

    public IngestListItem(final Ingest ingest,
            final IngestJobStatus lastStatus) {
        this.ingest = ingest;
        this.status = lastStatus;

    }

    public Long getId() {
        return this.ingest.getId();
    }

    public Date getLastRun() {
        return this.ingest.getLastRun();
    }

    public String getName() {
        return this.ingest.getName();
    }

    public String getNameOgpRepository() {
        return this.ingest.getNameOgpRepository();
    }

    public Date getNextRun() {
        return this.nextRun;
    }

    public IngestJobStatusValue getStatus() {
        if (this.status != null) {
            return this.status.getStatus();
        } else {
            return null;
        }
    }

    public InstanceType getType() {
        InstanceType type = null;
        if (this.ingest instanceof IngestOGP) {
            type = InstanceType.SOLR;
        } else if (this.ingest instanceof IngestGeonetwork) {
            type = InstanceType.GEONETWORK;
        } else if (this.ingest instanceof IngestCsw) {
            type = InstanceType.CSW;
        } else if (this.ingest instanceof IngestWebDav) {
            type = InstanceType.WEBDAV;
        } else if (this.ingest instanceof IngestFileUpload) {
            type = InstanceType.FILE;
        }
        return type;
    }

    public String getUrl() {
        return this.ingest.getActualUrl();
    }

    public boolean isInProgress() {
        return this.inProgress;
    }

    public void setInProgress(final boolean inProgress) {
        this.inProgress = inProgress;
    }

    public void setNextRun(final Date nextRun) {
        this.nextRun = nextRun;
    }

}
