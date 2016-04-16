var global = this || window;

Template.afReferenceTypeahead.hooks({
  rendered: function() {
    Meteor.typeahead.inject();
  }
});

function includeFlds() {
  var fields = {};
  _.each(arguments,function(fld) {
    fields[fld] = 1;
  });
  return fields;
}

AutoForm.addInputType("refTypeahead", {
  template: "afReferenceTypeahead",
  valueConverters: {
      valueConverters: {
      "stringArray": AutoForm.valueConverters.stringToStringArray,
      "number": AutoForm.valueConverters.stringToNumber,
      "numberArray": AutoForm.valueConverters.stringToNumberArray,
      "boolean": AutoForm.valueConverters.stringToBoolean,
      "booleanArray": AutoForm.valueConverters.stringToBooleanArray,
      "date": AutoForm.valueConverters.stringToDate,
      "dateArray": AutoForm.valueConverters.stringToDateArray
    }
  },
  valueOut: function() {
    if (this.data('refIdVal')) {
      return this.data('refIdVal');
    } else {
      var selector = {};
      selector[this.data('refNameFld')] = this.val();
      var rec = global[this.data('refCollection')].findOne(selector, { fields: includeFlds(this.data('refIdFld')) });
      return rec ? rec[this.data('refIdFld')] : undefined;
    }
  },
  contextAdjust: function (context) {
    var refRecord = context.reference;
    if (!refRecord) {
      throw "Missing reference field!";
    }
    if (_.isString(refRecord)) {
      refRecord = { collection: refRecord, idField: '_id', nameField: 'name' };
    }
    var atts = context.atts;
    var refCollection = global[refRecord.collection];
    if (!_.isObject(refCollection)) {
      throw "Missing collection " + refCollection + " for reference typeahead!";
    }
    var idField = refRecord.idField || '_id';
    var nameField = refRecord.nameField || 'name';
    
    if (context.value) {
      var selector = value;
      if (idField!=='_id') {
        selector = {};
        selector[idField] = value;
      }
      var rec = refCollection.findOne(selector, { fields: includeFlds(nameField)});
      if (rec) {
        atts['data-refIdVal'] = context.value;
        context.value = rec[nameField];
      } else {
        context.value = undefined;
      }
    }
    
    atts["data-source"] = createSourceHelper(refCollection,refRecord.collection,idField,nameField);
    atts["data-refCollection"] = refRecord.refCollection;
    atts["data-refIdFld"] = idField;
    atts["data-refNameFld"] = nameField;
    atts["data-select"] = 'afRefTypeaheadSelected';
    return context;
  }
});

function createSourceHelper(refCollection,refCollectionName,idFld,nameFld) {
  var helperName = "afta" + refCollectionName + idFld + nameFld;
  
  if (!_.has(Blaze._globalHelpers, helperName)) {
    Template.registerHelper(helperName, function(query, sync, callback) {
      var selector = {};
      selector[nameFld] = { $regex: '(?i)' + query };
      var results = refCollection.find(selector, { limit: 50, fields: includeFlds(nameFld,idFld) }).
        map(function(rec) {
          return { id: rec[idFld], value: rec[nameFld] };
      });
      callback(results);
    });
  }
  return helperName;
}

Template.registerHelper('afRefTypeaheadSelected',function(event, suggestion, datasetName) {
  $(event.target).data('refIdVal', suggestion.id)
});

