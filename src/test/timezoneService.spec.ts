import "../core/extension_methods/String";
import "../core/extension_methods/Moment";

import { TimezoneService } from "../bll/timezoneService";
import { setupRepository, setupWorldTimeApi } from "./dependencySetups";
import { expect } from "chai";
import { asyncShouldThrow } from "./helpers";
import moment from "moment";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("timezone service", () => {
  describe("time at", () => {
    it("zone is not known", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const repo = setupRepository({ isKnownZone: false });
      const tzApi = setupWorldTimeApi();
      const service = new TimezoneService(repo, tzApi);

      //Assert
      await asyncShouldThrow(() => service.timeAt(param), "unknown timezone");
    });

    it("gets time from cache", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const path = 'America/Argentina/Buenos_Aires';
      const date = moment();

      const repo = setupRepository({ isKnownZone: true, validPath: path, updateCache: false, cachedTimezone: date.lxStoreFormat() });
      const tzApi = setupWorldTimeApi();
      const service = new TimezoneService(repo, tzApi);

      //Act
      const result = await service.timeAt(param);

      //Assert
      expect(result).to.be.equal(date.lxFormat());
    })

    it("gets time from api", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const path = 'America/Argentina/Buenos_Aires';
      const date = moment();

      const repo = setupRepository({ isKnownZone: true, validPath: path, updateCache: true });

      const tzApi = setupWorldTimeApi({ time: { datetime: date.lxApiFormat() } });

      const service = new TimezoneService(repo, tzApi);

      //Act
      const result = await service.timeAt(param);

      //Assert
      expect(result).to.be.equal(date.lxFormat());
    })

    it("invalid timezone", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const path = 'America/Argentina/Buenos_Aires';

      const repo = setupRepository({ isKnownZone: true, validPath: path, updateCache: true });

      const tzApi = setupWorldTimeApi({ time: { datetime: 'noISOdate' } });

      const service = new TimezoneService(repo, tzApi);

      //Assert
      await asyncShouldThrow(() => service.timeAt(param), "invalid timezone");
    })
  });
});
