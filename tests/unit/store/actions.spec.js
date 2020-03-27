import DiscoveryApi from "../../../src/api/DiscoveryApi";
import actions from "../../../src/store/actions";
import StringUtils from "../../../src/utils/stringUtils";
import IpApi from "../../../src/api/IpApi";

const event = {
  id: "1",
  name: "Party",
  dates: {
    start: {
      localDate: "2020-03-20"
    }
  },
  price: "Free",
  images: [
    { url: "foo"}
  ],
  favorite: false,
  url: "url"
};

const formattedEvent = {
  id: "1",
  name: "Party",
  date: "Friday, 20 March 2020",
  price: "Free",
  image: "foo",
  favorite: false,
  url: "url"
};

describe("Actions", () => {
  const events = [event];
  const page = { totalPages: 10 };

  let commit = jest.fn();
  let dispatch = jest.fn();

  let context = {
    commit,
    dispatch
  };

  beforeEach(() => {
    jest.spyOn(StringUtils, "getDate").mockImplementation();
    jest.spyOn(StringUtils, "getPrice").mockImplementation();
    jest.spyOn(StringUtils, "getWeekDayName").mockImplementation();
    jest.spyOn(StringUtils, "getMonthName").mockImplementation();
  });

  test("getEvents", async () => {
    const spyFetchEvents = jest
      .spyOn(DiscoveryApi, "fetchEvents")
      .mockReturnValue({ _embedded: { events }, page });
    const spyFetchCountryCode = jest
        .spyOn(IpApi, "fetchCountryCode")
        .mockReturnValue("DE");

    await actions.getEvents(context, { page: 0 });
    expect(spyFetchCountryCode).toHaveBeenCalled();
    expect(spyFetchEvents).toHaveBeenCalledWith(0, "date,asc", "DE");
    expect(context.commit).toHaveBeenCalledWith("saveEvents", [formattedEvent]);
    expect(context.commit).toHaveBeenCalledWith("saveTotalPages", page.totalPages);
  });

  test("addToFavorites", async () => {
    await actions.addToFavorites(context, event);
    expect(context.commit).toHaveBeenCalledWith("saveFavorite", event.id);
    expect(context.commit).toHaveBeenCalledWith("updateFavoritesList", event);
  });

  test("getFavorites", async () => {
    await actions.getFavorites(context);
    expect(context.commit).toHaveBeenCalledWith("saveEvents", [formattedEvent]);
  });
});