<?php
// Items for dropdownlists
    $status = ZHtml::enumItem(Servers::model(), 'server_type');

    // Add default blank value for search fields.
    $search_status = array(''=>'') + $status;
?>

<div id="servers-list" class="table-main" style="display:none;">
    <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
    <fieldset>
        <input type="hidden" id="servers-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
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
                        <th width="200">Name</th>
                        <th width="160">Type</th>
                        <th width="200">Public IP</th>
                        <th width="200">Private IP</th>
                        <th width+"200">Network</th>
                        <th width="100"></th>
                    </tr>
                    <tr>
                        <th><input id="servers-list-search-name" type="text" style="width:180px;"/></th>
                        <th>
                            <select class="select" name="servers-list-search-type" id="servers-list-search-type" style="width:140px;">
                                <?php
                                    foreach($search_status as $key => $value)
                                    {
                                        ?>
                                        <option value="<?= $key ?>"><?= $value ?></option>
                                        <?php
                                    }
                                ?>
                            </select>
                        </th>
                        <th><input id="servers-list-search-public" type="text" style="width:180px;"/></th>
                        <th><input id="servers-list-search-private" type="text" style="width:180px;"/></th>
                        <th><input id="servers-list-search-network" type="text" style="width:180px;"/></th>
                        <th><div><button id="servers-list-search-button" class="red-button">Search</button></div><a href="#" id="servers-list-clear-button">Clear</a></th>
                    </tr>
                </thead>
                <tbody id="servers-list-table"></tbody>
            </table>
        </div>
        
    </fieldset>
    </form> <!--this is for the CHtml form-->
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->