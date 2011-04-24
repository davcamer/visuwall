/**
 * Copyright (C) 2010 Julien SMADJA <julien dot smadja at gmail dot com> - Arnaud LEMAIRE <alemaire at norad dot fr>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package net.awired.visuwall.bambooclient.builder;

public class BambooUrlBuilder {

    private String bambooUrl;

    public BambooUrlBuilder(String bambooUrl) {
        this.bambooUrl = bambooUrl + "/rest/api/";
    }

    public String getAllProjectsUrl() {
        return bambooUrl + "latest/plan";
    }

    public String getProjectsUrl(String projectName) {
        return bambooUrl+"latest/result/"+projectName+ "?expand=results.result";
    }

    public String getBuildUrl(String projectName, int buildNumber) {
        return bambooUrl+"latest/result/"+projectName+"-"+buildNumber+"?expand=changes,metadata,stages,labels,jiraIssues,comments";
    }

    public String getLatestBuildResult(String projectName) {
        return bambooUrl+"latest/result/"+projectName;
    }

    public String getIsBuildingUrl(String projectName) {
        return bambooUrl+"latest/plan/"+projectName;
    }

    public String getLastBuildUrl() {
        return bambooUrl + "latest/build";
    }
}
