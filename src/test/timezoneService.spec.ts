import "../core/extension_methods/String";
import "../core/extension_methods/Moment";

import { TimezoneService } from "../bll/timezoneService";
import { setupQuery, setupTransaction, setupWorldTimeApi } from "./dependencySetups";
import { expect } from "chai";
import { asyncShouldThrow } from "./helpers";
import moment from "moment";

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("timezone service", () => {
  describe("time at", () => {
    const transac = setupTransaction();

    it("zone is not known", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const query = setupQuery({ isKnownZone: false });
      const tzApi = setupWorldTimeApi();
      const service = new TimezoneService(query, transac, tzApi);

      //Assert
      await asyncShouldThrow(() => service.timeAt(param), "unknown timezone");
    });

    it("gets time from cache", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const path = 'America/Argentina/Buenos_Aires';
      const date = moment(); //Hell dependency

      const query = setupQuery({ isKnownZone: true, validPath: path, updateCache: false, cachedTimezone: date.lxStoreFormat() });
      const tzApi = setupWorldTimeApi();
      const service = new TimezoneService(query, transac, tzApi);

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

      const query = setupQuery({ isKnownZone: true, validPath: path, updateCache: true });

      const tzApi = setupWorldTimeApi({ time: { datetime: date.lxStoreFormat() } });

      const service = new TimezoneService(query, transac, tzApi);

      //Act
      const result = await service.timeAt(param);

      //Assert
      expect(result).to.be.equal(date.lxFormat());
    })

    it("invalid timezone", async () => {
      //Arrange
      const param = "Buenos_Aires";
      const path = 'America/Argentina/Buenos_Aires';

      const query = setupQuery({ isKnownZone: true, validPath: path, updateCache: true });

      const tzApi = setupWorldTimeApi({ time: { datetime: 'noISOdate' } });

      const service = new TimezoneService(query, transac, tzApi);

      //Assert
      await asyncShouldThrow(() => service.timeAt(param), "invalid timezone");
    })
  });
});
