import "../core/extension_methods/String";
import "../core/extension_methods/Moment";

import { TimezoneService } from "../bll/timezoneService";
import { AppError } from "../core/appError";
import { setupQuery, setupTransaction, setupWorldTimeApi } from "./dependencySetups";
import { assert, expect } from "chai";
import { asyncShouldThrow } from "./helpers";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// areZonesPopulated(){ return Promise.resolve(areZonesPopulated) },
//         getCachedTimeZone(){ return Promise.resolve('cached_timezone') },
//         getRequestsCount(lookup){ return Promise.resolve('1') },
//         getValidRegionPath(lookup){ return Promise.resolve('valid_path') },
//         isKnownZone(lookup){ return Promise.resolve(false) },
//         shouldUpdateCache(lookup){ return Promise.resolve(false) }

describe("timezone service", () => {
  describe("time at", () => {
    it("zone is not known", async () => {
      //Arrange
      const query = setupQuery({ isKnownZone: false });
      const transac = setupTransaction();
      const tzApi = setupWorldTimeApi();
      const service = new TimezoneService(query, transac, tzApi);

      const param = "BuenosAires";

      //Assert
      await asyncShouldThrow(() => service.timeAt(param), "unknown timezone");
    });
  });
});
