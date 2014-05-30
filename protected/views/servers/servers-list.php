<?php
// Items for dropdownlists
    $types = ZHtml::enumItem(Servers::model(), 'server_type');

    // Add default blank value for search fields.
    $search_types = array(''=>'') + $types;
?>

<div id="servers-list" class="table-main">
    <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
    <input type="hidden" id="servers-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
    <fieldset>
        <div class="table-header-block">
            <div class="header-block-button">
                <a id="servers-list-create-button" class="button round blue image-right ic-add text-upper" href="#">Create Server</a>
            </div><!-- End Header Block Button -->

            <div class="header-block-side">
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="servers-list-part"></span>
                        <span class="all-page" id="servers-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="servers-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="servers-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div><!-- End Header Block Side -->
        </div><!-- End Table Header Block -->
        
        <div id="content-div">
            <table>
                <thead>
                    <tr>                      
                        <th>Name</th>
                        <th>Type</th>
                        <th>Host</th>
                        <th>Private IP</th>
                        <th>Network</th>
                        <th>Actions</th>
                    </tr>
                    <tr>
                        <th><input id="servers-list-search-name" type="text"/></th>
                        <th>
                            <select class="select" name="servers-list-search-type" id="servers-list-search-type">
                                <?php
                                    foreach($search_types as $key => $value)
                                    {
                                        ?>
                                        <option value="<?= $key ?>"><?= $value ?></option>
                                        <?php
                                    }
                                ?>
                            </select>
                        </th>
                        <th><input id="servers-list-search-host" type="text"/></th>
                        <th><input id="servers-list-search-private" type="text"/></th>
                        <th><input id="servers-list-search-network" type="text"/></th>
                        <th><div><button id="search-submit">Search</button></div><a href="#" id="servers-list-clear-button">Clear</a></th>
                    </tr>
                </thead>
                <tbody id="servers-list-table">
                </tbody>
            </table>
        </div>
        
    </fieldset>
    </form> <!--this is for the CHtml form-->
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->