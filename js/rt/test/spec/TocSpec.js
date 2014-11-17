"use strict";

/* global jQuery, RT */

describe("TOC - building", function() {

  it("TOC should be defined", function() {
    expect(TOC).toBeDefined();
  });

  it("should have a clearTOC function", function() {
    expect(TOC.clearTOC).toBeDefined();
  });

  it("should have a currentLevel variable", function() {
    expect(TOC.currentLevel).toBeDefined();
  });


  /*
  describe("configureSelectors()", function() {
    it("should be defined", function() {
      expect(typeahead.configureSelectors).toBeDefined();
    });

    it("should not throw errors when called with empty object", function() {
      expect(function() {
        typeahead.configureSelectors({});
      }).not.toThrow();
    });

    it("should throw error when called without arguments", function() {
      expect(function() {
        typeahead.configureSelectors();
      }).toThrow();
    });
  });

  describe("configureEndpoint()", function() {
    it("should be defined", function() {
      expect(typeahead.configureEndpoint).toBeDefined();
    });
  });

  describe("getTypeaheadData()", function() {
    var noResultsSpy, connectionErrorSpy, listSpy;

    beforeEach(function() {
      noResultsSpy = {
        show: function() {},
        hide: function() {}
      };

      connectionErrorSpy = {
        show: function() {},
        hide: function() {}
      };

      listSpy = $("<tbody></tbody>");

      typeahead.configureSelectors({
        noSearchResultsTypeAheadItem: noResultsSpy,
        connectionErrorMessage: connectionErrorSpy,
        typeaheadList: listSpy
      });
    });

    it("should be defined", function() {
      expect(typeahead.getTypeaheadData).toBeDefined();
    });

    it("should show missing selectors error when no selectors are configured", function() {
      typeahead.configureSelectors({
        noSearchResultsTypeAheadItem: undefined,
        connectionErrorMessage: undefined,
        typeaheadList: undefined
      });

      expect(function() {
        typeahead.getTypeaheadData();
      }).toThrowError("Missing selectors");
    });

    it("should not show missing selectors error when selectors are configured", function() {
      expect(function() {
        typeahead.getTypeaheadData();
      }).not.toThrowError("Missing selectors");
    });

    it("should show connection error message when there is a connection error", function(done) {
      spyOn(connectionErrorSpy, "show");

      typeahead.configureEndpoint('notFoundFile.json');

      typeahead.getTypeaheadData("clientName", "");

      setTimeout( function() {
        expect(connectionErrorSpy.show).toHaveBeenCalled();
        done();
      }, 50);
    });

    it("should show noSearchResultsTypeAheadItem when receiving an empty response", function(done) {
      spyOn(noResultsSpy, "show");

      typeahead.configureEndpoint('./stubData/emptyClients.json');

      typeahead.getTypeaheadData("clientName", "", function() {
        expect(noResultsSpy.show).toHaveBeenCalled();
        done();
      });

    });

    it("should not show noSearchResultsTypeAheadItem when receiving a non empty response", function(done) {
      spyOn(noResultsSpy, "show");
      spyOn(noResultsSpy, "hide");

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData("clientName", "", function() {
        expect(noResultsSpy.show).not.toHaveBeenCalled();
        expect(noResultsSpy.hide).toHaveBeenCalled();
        done();
      });

    });

    it('should generate the proper HTML snippet for client name search', function(done) {
      var expectedHtml =
        "  <tr data-spn='113581' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113581 - Bank Of Thailand" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='112563' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      112563 - Bank of Norway" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1823829' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1823829 - Blackrock Capital" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1034865' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1034865 - Blackrock IMUK Ltd." +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1823830' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1823830 - MetLife, Inc." +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='932051' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      932051 - Skandinaviska Enskilda Banken Of The Honorable And Greatest Kingdom Of Skandinaviska Country" +
        "    </td>" +
        "  </tr>";
      spyOn(listSpy, 'append');

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientName', '', function() {
        expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
        done();
      });
    });

    it('should generate the proper HTML snippet for client SPN search', function(done) {
      var expectedHtml =
        "  <tr data-spn='113581' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113581 - Bank Of Thailand" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='112563' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      112563 - Bank of Norway" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1823829' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1823829 - Blackrock Capital" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1034865' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1034865 - Blackrock IMUK Ltd." +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='1823830' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      1823830 - MetLife, Inc." +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='932051' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      932051 - Skandinaviska Enskilda Banken Of The Honorable And Greatest Kingdom Of Skandinaviska Country" +
        "    </td>" +
        "  </tr>";
      spyOn(listSpy, 'append');

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientSPN', '', function() {
        expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
        done();
      });
    });

    it('should generate the proper HTML snippet for account number search', function(done) {
      var expectedHtml =
        "  <tr data-spn='1823830' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      55555 - Metropolitan Life Inc." +
        "    </td>" +
        "  </tr>";
      spyOn(listSpy, 'append');

      typeahead.configureEndpoint('./stubData/validAccount.json');

      typeahead.getTypeaheadData('accountNumber', '', function() {
        expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
        done();
      });
    });

    it('should highlight searched text in the generated HTML snippet for client name search',
      function(done) {
        var expectedHtml =
          "  <tr data-spn='113581' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      113581 - <strong>Ban</strong>k Of Thailand" +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='112564' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      112564 - <strong>Ban</strong>k of Umbanda" +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='1823883' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      1823883 - <strong>BAN</strong> First Co." +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='1034866' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      1034866 - Um<strong>ban</strong>da First National Bank" +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='932051' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      932051 - Skandinaviska Enskilda <strong>Ban</strong>ken Of The Honorable And Greatest Kingdom Of Skandinaviska Country" +
          "    </td>" +
          "  </tr>";
        spyOn(listSpy, 'append');

        typeahead.configureEndpoint('./stubData/nameSearchResults.json');

        typeahead.getTypeaheadData('clientName', 'ban', function() {
          expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
          done();
        }
      );
    });

    it('should highlight searched text in the generated HTML snippet for client SPN search',
      function(done) {
        var expectedHtml =
          "  <tr data-spn='113113' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      <strong>113</strong>113 - Bank Of Thailand" +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='113564' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      <strong>113</strong>564 - Bank of Umbanda" +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='1823113' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      1823<strong>113</strong> - BAN First Co." +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='1134866' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      <strong>113</strong>4866 - Umbanda 113th National Bank" +
          "    </td>" +
          "  </tr>";
        spyOn(listSpy, 'append');

        typeahead.configureEndpoint('./stubData/spnSearchResults.json');

        typeahead.getTypeaheadData('clientSPN', '113', function() {
          expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
          done();
        }
      );
    });

    it('should highlight searched text in the generated HTML snippet for account number search',
      function(done) {
        var expectedHtml =
          "  <tr data-spn='1823830' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      <strong>555</strong>55 - Metropolitan Life Inc." +
          "    </td>" +
          "  </tr>" +
          "  <tr data-spn='1824330' class='autoRow typeaheadItem'>" +
          "    <td class='celPad'>" +
          "      43<strong>555</strong> - Metropolitan Developments" +
          "    </td>" +
          "  </tr>";
        spyOn(listSpy, 'append');

        typeahead.configureEndpoint('./stubData/accountSearchResults.json');

        typeahead.getTypeaheadData('accountNumber', '555', function() {
          expect(listSpy.append).toHaveBeenCalledWith(expectedHtml);
          done();
        }
      );
    });

    it("should sanitize search text before usign it in a RegExp", function(done) {
      var expectedHtmlWithDot =
        "  <tr data-spn='113581' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113581 - Wilcox <strong>Co.</strong>" +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='113582' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113582 - US$ Moneylenders" +
        "    </td>" +
        "  </tr>";

      var expectedHtmlWithDollarsign =
        "  <tr data-spn='113581' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113581 - Wilcox Co." +
        "    </td>" +
        "  </tr>" +
        "  <tr data-spn='113582' class='autoRow typeaheadItem'>" +
        "    <td class='celPad'>" +
        "      113582 - <strong>US$</strong> Moneylenders" +
        "    </td>" +
        "  </tr>";

      spyOn(listSpy, 'append');

      typeahead.configureEndpoint('./stubData/regexpSearchResults.json');

      typeahead.getTypeaheadData('clientName', 'Co.', function() {
        expect(listSpy.append).toHaveBeenCalledWith(expectedHtmlWithDot);

        typeahead.getTypeaheadData('clientName', 'US$', function() {
          expect(listSpy.append).toHaveBeenCalledWith(expectedHtmlWithDollarsign);
          done();
        });

      });
    });
  });

  describe("manageKeystroke()", function() {
    it("should be defined", function () {
      expect(typeahead.manageKeystroke).toBeDefined();
    });
  });

  describe("isSelectionEmpty()", function() {
    it("should be defined", function() {
      expect(typeahead.isSelectionEmpty).toBeDefined();
    });

    it("should return true when no items are selected", function (done) {
      expect(typeahead.isSelectionEmpty()).toBe(true);

      var typeaheadListMock = $('<tbody></tbody>');

      typeahead.configureSelectors({
        typeaheadList: typeaheadListMock,
        noSearchResultsTypeAheadItem: $('<div></div>')
      });
      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientName', '', function() {
        expect(typeahead.isSelectionEmpty()).toBe(true);
        done();
      });
    });

    it("should return false when items are selected", function (done) {
      var typeaheadListMock = $('<tbody></tbody>');

      typeahead.configureSelectors({
        typeaheadList: typeaheadListMock,
        noSearchResultsTypeAheadItem: $('<div></div>')
      });
      typeahead.configureEndpoint('./stubData/validClients.json');


      typeahead.getTypeaheadData('clientName', '', function() {
        typeaheadListMock.children('.typeaheadItem').first().addClass('selectedAutoResult');
        expect(typeahead.isSelectionEmpty()).toBe(false);
        done();
      });
    });
  });

  describe("events", function() {
    var typeaheadListMock;

    beforeEach(function() {
      typeaheadListMock = $("<tbody></tbody>");

      typeahead.configureSelectors({
        typeaheadList: typeaheadListMock,
        noSearchResultsTypeAheadItem: $("<div></div>")
      });
      typeahead.configureEndpoint('./stubData/validClients.json');
    });

    it("should highlight typeahead results onmouseover", function(done) {

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children().first();
        expect(firstItem.hasClass('selectedAutoResult')).toBe(false);

        firstItem.trigger('mouseover');
        expect(firstItem.hasClass('selectedAutoResult')).toBe(true);
        done();
      });
    });

    it("should un-highlight typeahead results onmouseout", function(done) {
      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children().first();

        firstItem.trigger('mouseover');
        firstItem.trigger('mouseout');
        expect(firstItem.hasClass('selectedAutoResult')).toBe(false);
        done();
      });
    });

    it("should bind clicks on typeahead results", function(done) {
      typeahead.onSelection(function() {
        expect(true).toBe(true);
        done();
      });

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children().first();
        firstItem.trigger('click');
      });
    });

    it("should pass back SPN on client selection by client name", function(done) {
      typeahead.onSelection(function(spn) {
        expect(spn).toBe(113581);
        done();
      });

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children().first();
        firstItem.trigger('click');
      });
    });

    it("should pass back SPN on client selection by SPN", function(done) {
      typeahead.onSelection(function(spn) {
        expect(spn).toBe(113581);
        done();
      });

      typeahead.getTypeaheadData('clientSPN', '', function() {
        var firstItem = typeaheadListMock.children().first();
        firstItem.trigger('click');
      });
    });

    it("should pass back SPN on client selection by account number", function(done) {
      typeahead.configureEndpoint('./stubData/validAccount.json');

      typeahead.onSelection(function(spn) {
        expect(spn).toBe(1823830);
        done();
      });

      typeahead.getTypeaheadData('accountNumber', '', function() {
        var firstItem = typeaheadListMock.children().first();
        firstItem.trigger('click');
      });
    });

    it("should select the first result on [down] keypress", function(done) {
      var e = new jQuery.Event('keydown', { which: 40 });

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children('tr').first();
        expect(firstItem.hasClass('selectedAutoResult')).toBe(false);
        typeahead.manageKeystroke(e);
        expect(firstItem.hasClass('selectedAutoResult')).toBe(true);
        done();
      });
    });

    it("should select the second result after pressing the [down] key twice", function(done) {
      var e = new jQuery.Event('keydown', { which: 40 });

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children('tr').first();
        var secondItem = typeaheadListMock.children('tr').first().next();
        expect(secondItem.hasClass('selectedAutoResult')).toBe(false);
        typeahead.manageKeystroke(e);
        typeahead.manageKeystroke(e);
        expect(firstItem.hasClass('selectedAutoResult')).toBe(false);
        expect(secondItem.hasClass('selectedAutoResult')).toBe(true);
        done();
      });
    });

    it("should move up on [up] keypress", function(done) {
      var downKeyEvent = new jQuery.Event('keydown', { which: 40 });
      var upKeyEvent = new jQuery.Event('keydown', { which: 38 });

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.getTypeaheadData('clientName', '', function() {
        var firstItem = typeaheadListMock.children('tr').first();
        typeahead.manageKeystroke(downKeyEvent);
        typeahead.manageKeystroke(downKeyEvent);
        expect(firstItem.hasClass('selectedAutoResult')).toBe(false);
        typeahead.manageKeystroke(upKeyEvent);
        expect(firstItem.hasClass('selectedAutoResult')).toBe(true);
        done();
      });
    });

    it("should select on [enter] keypress", function(done) {
      var downKeyEvent = new jQuery.Event('keydown', { which: 40 });
      var enterKeyEvent = new jQuery.Event('keydown', { which: 13 });

      typeahead.configureEndpoint('./stubData/validClients.json');

      typeahead.onSelection(function(spn) {
        expect(spn).toBe(113581);
        done();
      });

      typeahead.getTypeaheadData('clientName', '', function() {
        typeahead.manageKeystroke(downKeyEvent);
        typeahead.manageKeystroke(enterKeyEvent);
      });
    });
  });
  */
});
