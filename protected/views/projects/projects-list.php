<?php
// Items for dropdownlists
    $status = ZHtml::enumItem(Projects::model(), 'status');

    // Add default blank value for search fields.
    $search_status = array(''=>'') + $status;
?>

<div id="projects-list" class="table-main">
    <?php echo CHtml::form('', 'post', array('id'=>'export-form', 'enctype'=>'multipart/form-data')); ?>
    <fieldset>
        <div class="table-header-block">
            <div class="header-block-button">
                <a id="projects-list-create-button" class="button round blue image-right ic-add text-upper" href="#">Create Project</a>
            </div><!-- End Header Block Button -->

            <div class="header-block-side">
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="projects-list-part"></span>
                        <span class="all-page" id="projects-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="projects-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="projects-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div><!-- End Header Block Side -->
        </div><!-- End Table Header Block -->
        
        <div id="content-div">
            <table>
                <thead>
                    <tr>                      
                        <th width='150'>Name</th>
                        <th width='90'>Code</th>
                        <th width=''>Description</th>
                        <th width='115'>Status</th>
                        <th width='120'>Production Date</th>
                        <th width=''>Actions</th>
                    </tr>
                    <tr>
                        <th><input id="projects-list-search-name" type="text" style="width:130px"/></th>
                        <th><input id="projects-list-search-code" type="text" style="width:70px"/></th>
                        <th>&nbsp;</th>
                        <th>
                            <select class="select" name="projects-list-search-status" id="projects-list-search-status" style="width:115px;">
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
                        <th>&nbsp;</th>
                        <th><div><button id="search-submit">Search</button></div><a href="#" id="projects-list-clear-button">Clear</a></th>
                    </tr>
                </thead>
                <tbody id="projects-list-table"></tbody>
            </table>
        </div>
        
    </fieldset>
    </form> <!--this is for the CHtml form-->
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->